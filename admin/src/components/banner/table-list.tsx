import { PureComponent } from 'react';
import {
  Select, Table, Tag, message
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ThumbnailBanner } from '@components/banner/thumbnail-banner';
import { DropdownAction } from '@components/common/dropdown-action';
import { bannerService } from '@services/banner.service';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteBanner?: Function;
}

export class TableListBanner extends PureComponent<IProps> {
  render() {
    const { deleteBanner } = this.props;
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const handleSelectStatusChange = async (e) => {
      const value = JSON.parse(e);
      try {
        await bannerService.update(value.id, { status: value.status });
        message.success('Successfully!');
      } catch (error) {
        message.error('Error occurred, please try again later');
      }
    };
    const columns = [
      {
        title: '',
        dataIndex: 'thumbnail',
        render(data, record) {
          return <ThumbnailBanner banner={record} />;
        }
      },
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: true
      },
      {
        title: 'Position',
        dataIndex: 'position',
        sorter: true,
        render(pos: string) {
          switch (pos) {
            case 'homeTop':
              return <Tag color="default">Home top</Tag>;
            case 'homeBottom':
              return <Tag color="default">Home bottom</Tag>;
            case 'rightSidebar':
              return <Tag color="red">Right sidebar</Tag>;
            default:
              return <Tag color="default">{pos}</Tag>;
          }
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        render(status: string, id) {
          return (
            <Select onChange={handleSelectStatusChange} defaultValue={capitalizeFirstLetter(status)}>
              <Select.Option key="Yes" value={JSON.stringify({ status: 'active', id: id._id })}>
                Active
              </Select.Option>
              <Select.Option key="No" value={JSON.stringify({ status: 'inactive', id: id._id })}>
                Inactive
              </Select.Option>
            </Select>
          );
        //   switch (status) {
        //     case 'active':
        //       return <Tag color="green">Active</Tag>;
        //     case 'inactive':
        //       return <Tag color="red">Inactive</Tag>;
        //     default:
        //       return <Tag color="default">{status}</Tag>;
        //   }
        }
      },
      {
        title: 'Last update',
        dataIndex: 'updatedAt',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      },
      {
        title: 'Actions',
        dataIndex: '_id',
        render: (id: string) => (
          <DropdownAction
            menuOptions={[
              {
                key: 'update',
                name: 'Update',
                children: (
                  <Link
                    href={{
                      pathname: '/banner/update',
                      query: { id }
                    }}
                    as={`/banner/update?id=${id}`}
                  >
                    <a>
                      <EditOutlined />
                      {' '}
                      Update
                    </a>
                  </Link>
                )
              },
              {
                key: 'delete',
                name: 'Delete',
                children: (
                  <span>
                    <DeleteOutlined />
                    {' '}
                    Delete
                  </span>
                ),
                onClick: () => deleteBanner && deleteBanner(id)
              }
            ]}
          />
        )
      }
    ];
    const {
      dataSource, rowKey, loading, pagination, onChange
    } = this.props;
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        onChange={onChange.bind(this)}
      />
    );
  }
}
