import {
  Select, Table, Tag, message
} from 'antd';
import {
  DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
import { ICategory } from 'src/interfaces';
import { categoryService } from '@services/category.service';

interface IProps {
  dataSource: ICategory[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
  // eslint-disable-next-line react/require-default-props
  deleteCategory?: Function;
}

export function TableListCategory({
  dataSource,
  rowKey,
  loading,
  pagination,
  onChange,
  deleteCategory = () => {}
}: IProps) {
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
  const handleSelectStatusChange = async (e) => {
    const value = JSON.parse(e);
    try {
      await categoryService.update(value.id, { status: value.status });
      message.success('Successfully!');
    } catch (error) {
      message.error('Error occurred, please try again later');
    }
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Group',
      dataIndex: 'group',
      render(group: string) {
        switch (group) {
          case 'video':
            return <Tag color="blue">Video</Tag>;
          case 'gallery':
            return <Tag color="pink">Gallery</Tag>;
          case 'product':
            return <Tag color="red">Product</Tag>;
          case 'performer':
            return <Tag color="orange">Escort</Tag>;
          case 'post':
            return <Tag color="violet">Page</Tag>;
          case '':
            return <Tag color="green">All</Tag>;
          default: return <Tag color="default">{group}</Tag>;
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string, id) {
        return (
          <Select onChange={handleSelectStatusChange} defaultValue={capitalizeFirstLetter(status)}>
            <Select.Option key="active" value={JSON.stringify({ status: 'active', id: id._id })}>
              Active
            </Select.Option>
            <Select.Option key="inactive" value={JSON.stringify({ status: 'inactive', id: id._id })}>
              Inactive
            </Select.Option>
          </Select>
        );
        // switch (status) {
        //   case 'active':
        //     return <Tag color="green">Active</Tag>;
        //   case 'inactive':
        //     return <Tag color="red">Inactive</Tag>;
        //   default: return <Tag color="default">{status}</Tag>;
        // }
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
      render: (data, record) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={{
                    pathname: '/categories/update',
                    query: { id: record._id }
                  }}
                  as={`/categories/update?id=${record._id}`}
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
              onClick: () => deleteCategory(record._id)
            }
          ]}
        />
      )
    }
  ];

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
