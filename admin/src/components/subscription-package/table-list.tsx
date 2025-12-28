import { ISubscriptionPackage } from 'src/interfaces';
import { PureComponent } from 'react';
import { formatDate } from '@lib/date';
import {
  Select, Table, Tag, message
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
import { subscriptionPackageService } from '@services/subscription-package.service';

interface IProps {
  dataSource: ISubscriptionPackage[];
  rowKey: string;
  deletePackage: Function;
  loading: boolean;
  onChange: Function;
  total: number;
}

export class SubscriptionPackageTable extends PureComponent<IProps> {
  render() {
    const {
      deletePackage, dataSource, rowKey, loading, onChange, total
    } = this.props;
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const handleSelectStatusChange = async (e) => {
      const value = JSON.parse(e);

      try {
        const resp = await subscriptionPackageService.findOne(value.id);
        const dataResp = resp.data;
        dataResp.isActive = value.status;
        await subscriptionPackageService.update(value.id, dataResp);
        message.success('Successfully!');
      } catch (error) {
        message.error('Error occurred, please try again later');
      }
    };
    const Columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        align: 'center' as 'center'
      },
      {
        title: 'Membership type',
        dataIndex: 'membershipType',
        key: 'membershipType',
        align: 'center' as 'center'
      },
      {
        title: 'Initial Period',
        dataIndex: 'initialPeriod',
        key: 'initialPeriod',
        align: 'center' as 'center'
      },
      {
        title: 'Recurring Price',
        dataIndex: 'recurringPrice',
        key: 'recurringPrice',
        align: 'center' as 'center'
      },
      {
        title: 'Recurring Period',
        dataIndex: 'recurringPeriod',
        key: 'recurringPeriod',
        align: 'center' as 'center'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        render(type: string) {
          switch (type) {
            case 'single':
              return <Tag color="blue">Single</Tag>;
            case 'recurring':
              return <Tag color="orange">Recurring</Tag>;
            default:
              return <Tag color="default">{type}</Tag>;
          }
        }
      },
      {
        title: 'Ordering',
        dataIndex: 'ordering',
        key: 'ordering',
        align: 'center' as 'center'
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        render(status: boolean, id) {
          const value = status ? 'Active' : 'Inactive';
          return (
            <Select onChange={handleSelectStatusChange} defaultValue={capitalizeFirstLetter(value)}>
              <Select.Option key="active" value={JSON.stringify({ status: true, id: id._id })}>
                Active
              </Select.Option>
              <Select.Option key="inactive" value={JSON.stringify({ status: false, id: id._id })}>
                Inactive
              </Select.Option>
            </Select>
          );
          // switch (status) {
          //   case true:
          //     return <Tag color="green">Active</Tag>;
          //   case false:
          //     return <Tag color="red">Inactive</Tag>;
          //   default:
          //     return <Tag color="default">{status}</Tag>;
          // }
        }
      },
      {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render(data, record: ISubscriptionPackage) {
          return formatDate(record.updatedAt);
        }
      },
      {
        title: 'Action',
        dataIndex: '_id',
        key: 'action',
        render: (id: string) => (
          <DropdownAction
            menuOptions={[
              {
                key: 'update',
                name: 'Update',
                children: (
                  <Link
                    href={{
                      pathname: '/subscription-package/update',
                      query: { id }
                    }}
                    as={`/subscription-package/update?id=${id}`}
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
                onClick: () => deletePackage && deletePackage(id)
              }
            ]}
          />
        )
      }
    ];
    return (
      <Table
        dataSource={dataSource}
        columns={Columns}
        pagination={{
          total,
          pageSize: 10,
          showSizeChanger: false
        }}
        rowKey={rowKey}
        loading={loading}
        onChange={onChange.bind(this)}
      />
    );
  }
}
