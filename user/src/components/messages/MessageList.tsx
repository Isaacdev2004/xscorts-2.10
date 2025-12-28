/* eslint-disable space-infix-ops */
import { PureComponent, createRef } from 'react';
import {
  Spin, Button, Avatar, Modal, message as messageAntd
} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  loadMoreMessages, deactivateConversation, deleteMessage, updateIsBLocked
} from '@redux/message/actions';
import { IConversation, IUser } from '@interfaces/index';
import { blockUserService } from '@services/block-user.service';
import Compose from './Compose';
import Message from './Message';
import './MessageList.less';

interface IProps {
  sendMessage: any;
  deactivateConversation: Function;
  loadMoreMessages: Function;
  message: any;
  conversation: IConversation;
  currentUser: IUser;
  loggedIn: boolean;
  deleteMessage: Function;
  updateIsBLocked: Function;
}

class MessageList extends PureComponent<IProps> {
  messagesRef: any;

  state = {
    offset: 0,
    onLoadMore: false,
    openConfirmBlockModel: false,
    // isBlocked: false,
    currentTargetId: null
  }

  async componentDidMount() {
    if (!this.messagesRef) this.messagesRef = createRef();
    const { conversation } = this.props;
    if (conversation.recipientInfo?._id!=null) {
      this.setState({ currentTargetId: conversation.recipientInfo._id });
    }
  }

  async componentDidUpdate(prevProps) {
    const { conversation, message } = this.props;
    const { onLoadMore } = this.state;
    const { currentTargetId } = this.state;
    if (currentTargetId==null) {
      this.componentDidMount();
    }
    if (currentTargetId!==null && currentTargetId!==conversation.recipientInfo._id) {
      this.componentDidMount();
    }
    if (prevProps.conversation && prevProps?.conversation._id !== conversation?._id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ offset: 0 });
    }
    if ((prevProps.message.nonce !== message.items.nonce)) {
      if (onLoadMore) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ onLoadMore: false });
      } else {
        this.scrollToBottom();
      }
    }
  }

  // eslint-disable-next-line react/sort-comp
  async handleScroll(conversation, event) {
    const { message, loadMoreMessages: handleLoadMore } = this.props;
    const { offset } = this.state;
    const { fetching, items, total } = message;
    const canLoadMore = total > items.length;
    const ele = event.target;
    if (!canLoadMore) return;
    if (ele.scrollTop === 0 && conversation._id && !fetching && canLoadMore) {
      this.setState({ offset: offset + 1, onLoadMore: true },
        () => {
          const { offset: newOffset } = this.state;
          handleLoadMore({ conversationId: conversation._id, limit: 25, offset: newOffset * 25 });
        });
    }
  }

  handleDeleteMessage = (messageId) => {
    const { conversation, deleteMessage: dispatchDeleteMessage } = this.props;
    dispatchDeleteMessage({ messageId, conversationId: conversation._id });
  }

  renderMessages = () => {
    const { message, currentUser, conversation } = this.props;
    const recipientInfo = conversation && conversation.recipientInfo;
    const messages = message.items;

    let i = 0;
    const messageCount = messages.length;
    const tempMessages = [];
    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const next = messages[i + 1];
      const isMine = current.senderId === currentUser._id;
      const currentMoment = moment(current.createdAt);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        const previousMoment = moment(previous.createdAt);
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.senderId === current.senderId;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        const nextMoment = moment(next.createdAt);
        const nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.senderId === current.senderId;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
      if (current._id) {
        tempMessages.push(
          <Message
            key={i}
            isMine={isMine}
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
            data={current}
            recipient={recipientInfo}
            currentUser={currentUser}
            onDelete={() => this.handleDeleteMessage(current._id)}
          />
        );
      }
      // Proceed to the next message.
      i += 1;
    }
    return tempMessages;
  };

  scrollToBottom(toBot = true) {
    const { message: { fetching } } = this.props;
    const { offset } = this.state;
    if (!fetching && this.messagesRef && this.messagesRef.current) {
      const ele = this.messagesRef.current;
      window.setTimeout(() => {
        ele.scrollTop = toBot ? ele.scrollHeight + 100 : (ele.scrollHeight / (offset + 1) - 100);
      }, 500);
    }
  }

  handleBLock = async () => {
    const { conversation, updateIsBLocked: handleUpdateIsBLocked } = this.props;
    try {
      conversation.isBlocked
        ? await blockUserService.unblockUser(conversation.recipientInfo._id)
        : await blockUserService.blockUser({ targetId: conversation.recipientInfo._id });
      this.setState({ openConfirmBlockModel: false });
      handleUpdateIsBLocked({ conversation, isBlocked: !conversation.isBlocked });
      messageAntd.success('Successfully!');
    } catch (error) {
      messageAntd.error('Error occurred, please try again!');
    }
  };

  render() {
    const {
      conversation, currentUser, message, deactivateConversation: handleDeactiveConversation, loggedIn
    } = this.props;
    const { fetching } = message;
    const { openConfirmBlockModel } = this.state;
    const isModel = currentUser.roles.includes('performer');

    return (
      <div className="message-list" ref={this.messagesRef} onScroll={this.handleScroll.bind(this, conversation)}>
        {conversation && conversation._id
          ? (
            <>
              <div className="message-list-container">
                <div className="mess-recipient">
                  <span>
                    <Avatar alt="avatar" src={conversation?.recipientInfo?.avatar || '/no-avatar.png'} />
                    {' '}
                    {conversation?.recipientInfo?.name || conversation?.recipientInfo?.username || 'N/A'}
                  </span>
                  { isModel && (
                    <Button type="primary" danger onClick={() => this.setState({ openConfirmBlockModel: true })}>
                      {conversation.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  )}
                  <Button onClick={() => handleDeactiveConversation()} className="close-btn">
                    <ArrowLeftOutlined />
                    {' '}
                  </Button>
                  <Modal
                    title={conversation.isBlocked ? 'Confirm unblock user' : 'Confirm block user'}
                    onOk={this.handleBLock}
                    visible={openConfirmBlockModel}
                    onCancel={() => this.setState({ openConfirmBlockModel: false })}
                    footer={[
                      <Button key="back" type="primary" onClick={() => this.setState({ openConfirmBlockModel: false })}>
                        Cancel
                      </Button>,
                      <Button key="submit" danger type="primary" onClick={this.handleBLock}>
                        Yes
                      </Button>
                    ]}
                  >
                    <p>
                      {conversation.isBlocked ? 'Are you sure unblock this user' : 'Are you sure block this user'}
                      ?
                    </p>
                  </Modal>
                </div>
                {fetching && <div className="text-center"><Spin /></div>}
                {this.renderMessages()}
                {conversation.isBlocked && (
                <div style={{ color: 'red', textAlign: 'center' }}>
                  {
                currentUser.roles.includes('performer') ? 'You have blocked this user!' : 'This model has blocked you!'
                }
                </div>
                )}
              </div>
              <Compose disabled={!loggedIn || conversation.isBlocked} conversation={conversation} />
            </>
          )
          : <p className="text-center">Click on conversation to start</p>}
      </div>
    );
  }
}

const mapStates = (state: any) => {
  const { conversationMap, sendMessage } = state.message;
  const { activeConversation } = state.conversation;
  const messages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].items || []
    : [];
  const totalMessages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].total || 0
    : 0;
  const fetching = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].fetching || false : false;
  return {
    sendMessage,
    message: {
      items: messages,
      total: totalMessages,
      fetching,
      nonce: Math.random()
    },
    conversation: activeConversation,
    currentUser: state.user.current,
    loggedIn: state.auth.loggedIn
  };
};

const mapDispatch = {
  loadMoreMessages, deactivateConversation, deleteMessage, updateIsBLocked
};
export default connect(mapStates, mapDispatch)(MessageList);
