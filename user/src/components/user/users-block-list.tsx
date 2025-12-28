import { formatDate } from '@lib/date';
import {
  Avatar,
  Button, Modal, Table
} from 'antd';
import { useState } from 'react';

type IProps = {
  items: any[];
  searching: boolean;
  total: number;
  pageSize: number;
  onPaginationChange: Function;
  unblockUser: Function;
  submitting: boolean;
}

function UsersBlockList({
  items,
  searching,
  total,
  pageSize,
  onPaginationChange,
  unblockUser,
  submitting
}: IProps) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [targetId, setTargetId] = useState('');
  const dataSource = items.map((p) => ({ ...p, key: p._id }));
  const showModal = () => {
    setOpenConfirmModal(true);
  };
  const handleOk = async () => {
    // handling
    setOpenConfirmModal(false);
    unblockUser(targetId);
  };

  const handleCancel = () => {
    setOpenConfirmModal(false);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'targetInfo',
      key: 'avatar',
      render: (targetInfo: any) => (
        <Avatar size="large" src={targetInfo?.avatar || '/no-avatar.png'} />
      )
    },
    {
      title: 'Username',
      dataIndex: 'targetInfo',
      key: 'username',
      render: (targetInfo: any) => (
        <span>{targetInfo.username || 'N/A'}</span>
      )
    },
    // {
    //   title: 'Reason',
    //   dataIndex: 'reason',
    //   key: 'reason',
    //   render: (reason: any) => (
    //     <Tooltip title={reason}>
    //       <div style={{
    //         maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
    //       }}
    //       >
    //         {reason}
    //       </div>
    //     </Tooltip>
    //   )
    // },
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => <span>{formatDate(createdAt)}</span>,
      sorter: true
    },
    {
      title: 'Actions',
      key: '_id',
      render: (item) => (
        <Button
          className="unblock-user"
          type="primary"
          disabled={submitting}
          onClick={() => {
            setTargetId(item.targetId);
            showModal();
          }}
        >
          Unblock
        </Button>
      )
    }
  ];
  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: true }}
        pagination={{
          total,
          pageSize,
          showSizeChanger: false
        }}
        rowKey="_id"
        loading={searching}
        onChange={onPaginationChange.bind(this)}
      />
      <Modal
        title="Confirm unlock user"
        onOk={handleOk}
        visible={openConfirmModal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="default" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Yes
          </Button>
        ]}
      >
        <p>
          Are you sure unblock this user
          ?
        </p>
      </Modal>
    </>
  );
}

export default UsersBlockList;
