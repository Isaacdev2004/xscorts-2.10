import React from 'react';
import moment from 'moment';
import { IUser } from '@interfaces/index';
import { Image, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './Message.less';

interface IProps {
  data: any;
  isMine: boolean;
  startsSequence: boolean;
  endsSequence: boolean;
  showTimestamp: boolean;
  currentUser: IUser,
  recipient: IUser,
  onDelete: (messageId: string) => void;
}

export default function Message(props: IProps) {
  const {
    data, isMine, startsSequence, endsSequence, showTimestamp, currentUser, recipient, onDelete
  } = props;

  const friendlyTimestamp = moment(data.createdAt).format('LLLL');

  return (
    <div
      className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}
    >
      {data.text && (
        <div className="bubble-container">
          {!isMine && <img alt="" className="avatar" src={recipient?.avatar || '/no-avatar.png'} />}
          <div className="bubble" title={friendlyTimestamp}>
            {!data.imageUrl && data.text}
            {data.imageUrl && <Image alt="" src={data.imageUrl} width="180px" />}
          </div>
          {isMine && <img alt="" src={currentUser?.avatar || '/no-avatar.png'} className="avatar" />}
          {isMine && (
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(data.id)}
              className="delete-button"
            />
          )}
        </div>
      )}
      {showTimestamp && <div className="timestamp">{friendlyTimestamp}</div>}
    </div>
  );
}
