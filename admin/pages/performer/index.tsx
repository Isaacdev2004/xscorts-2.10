/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import Link from 'next/link';
import { PureComponent } from 'react';
import {
  Table, message, Tag, Avatar, Select
} from 'antd';
import Page from '@components/common/layout/page';
import { performerService } from '@services/performer.service';
import { SearchFilter } from '@components/performer/search-filter';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import { BreadcrumbComponent, DropdownAction, IMenuOption } from '@components/common';
import { formatResponString } from '@lib/string';
import Router from 'next/router';

interface IProps {
  status: string;
}

class Performers extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return {
      ...ctx.query
    };
  }

  state = {
    pagination: {} as any,
    searching: false,
    list: [],
    limit: 10,
    filter: {} as any,
    sortBy: 'createdAt',
    sort: 'desc'
  };

  async componentDidMount() {
    const { status } = this.props;
    if (status) {
      await this.setState({ filter: { status } });
    }
    this.search();
  }

  async handleTableChange(pagination, filters, sorter) {
    const pager = { ...pagination };
    pager.current = pagination.current;
    await this.setState({
      pagination: pager,
      sortBy: sorter.field || 'createdAt',
      sort: sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc'
    });
    this.search(pager.current);
  }

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.search();
  }

  async search(page = 1) {
    const {
      limit, sort, filter, sortBy, pagination
    } = this.state;
    try {
      await this.setState({ searching: true });

      const resp = await performerService.search({
        limit,
        offset: (page - 1) * limit,
        ...filter,
        sort,
        sortBy
      });
      this.setState({
        searching: false,
        list: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      this.setState({ searching: false });
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    // const [selectedOption, setSelectedOption] = useState('');
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const handleSelectStatusChange = async (e) => {
      const value = JSON.parse(e);
      try {
        await performerService.update(value.id, { status: value.status });
        message.success('Successfully!');
      } catch (error) {
        message.error('Error occurred, please try again later');
      }
    };
    const handleSelectVipChange = async (e) => {
      const value = JSON.parse(e);
      try {
        await performerService.update(value.id, { vip: value.vip });
        message.success('Successfully!');
      } catch (error) {
        message.error('Error occurred, please try again later');
      }
    };
    const handleSelectVerifiedChange = async (e) => {
      const value = JSON.parse(e);
      try {
        await performerService.update(value.id, { verified: value.verified });
        message.success('Successfully!');
      } catch (error) {
        message.error('Error occurred, please try again later');
      }
    };
    const columns = [
      {
        title: 'Avatar',
        dataIndex: 'avatar',
        render(avatar) {
          return <Avatar src={avatar || '/no-avatar.png'} />;
        }
      },
      {
        title: 'Display name',
        dataIndex: 'name'
      },
      {
        title: 'Username',
        dataIndex: 'username'
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        render(gender) {
          switch (gender) {
            case 'male':
              return <Tag color="blue">Male</Tag>;
            case 'female':
              return <Tag color="pink">Female</Tag>;
            case 'transgender':
              return <Tag color="violet">Transgender</Tag>;
            default:
              return <Tag color="blue">Male</Tag>;
          }
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status, id) {
          return status === 'active' || status === 'inactive' ? (
            <Select onChange={handleSelectStatusChange} defaultValue={capitalizeFirstLetter(status)}>
              <Select.Option key="active" value={JSON.stringify({ status: 'active', id: id._id })}>
                Active
              </Select.Option>
              <Select.Option key="inactive" value={JSON.stringify({ status: 'inactive', id: id._id })}>
                Inactive
              </Select.Option>
            </Select>
          ) : (
            <Select disabled defaultValue={formatResponString(status)} />
          );
        }
      },
      {
        title: 'Membership type',
        dataIndex: 'membershipType',
        render(membershipType) {
          return <Tag color="green">{membershipType}</Tag>;
        }
      },
      {
        title: 'Vip',
        render(record) {
          const { _id, status, vip } = record;
          const value = vip ? 'Yes' : 'No';

          return (
            <Select onChange={handleSelectVipChange} defaultValue={value} disabled={status === 'deleted'}>
              <Select.Option key="Yes" value={JSON.stringify({ vip: true, id: _id })}>
                Yes
              </Select.Option>
              <Select.Option key="No" value={JSON.stringify({ vip: false, id: _id })}>
                No
              </Select.Option>
            </Select>
          );
          // vip ? <Tag color="green">Yes</Tag> : <Tag color="default">No</Tag>;
        }
      },
      {
        title: 'Verified',
        render(record) {
          const { verified, _id, status } = record;
          const value = verified ? 'Yes' : 'No';
          return (
            <Select onChange={handleSelectVerifiedChange} defaultValue={value} disabled={status === 'deleted'}>
              <Select.Option key="Yes" value={JSON.stringify({ verified: true, id: _id })}>
                Yes
              </Select.Option>
              <Select.Option key="No" value={JSON.stringify({ verified: false, id: _id })}>
                No
              </Select.Option>
            </Select>
          );
          //  vip ? <Tag color="green">Yes</Tag> : <Tag color="default">No</Tag>;
        }
      },
      {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      },
      {
        title: '#',
        render(record: any) {
          const { _id: id, status } = record;
          const isDisabled = status === 'deleted';
          const menuOptions: IMenuOption[] = [
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={{
                    pathname: '/performer/update',
                    query: { id }
                  }}
                  as={`/performer/update?id=${id}`}
                >
                  <a>
                    <EditOutlined />
                    {' '}
                    Update
                  </a>
                </Link>
              ),
              isDisabled
            }
          ];
          if (status === 'request-to-delete') {
            menuOptions.push({
              key: 'approveToDelete',
              name: 'Approve to delete',
              children: (
                <>
                  <a>
                    <CheckOutlined />
                    {' '}
                    Approve to delete
                  </a>
                </>
              ),
              isDisabled,
              onClick: async () => {
                const result = await window.confirm('Are you sure to proceed with approving the deletion?');
                if (result) {
                  try {
                    await performerService.approveToDelete(id);
                    Router.reload();
                    message.success('Model deleted successfully!');
                  } catch (error) {
                    message.error('Something went wrong, please try again!');
                  }
                }
              }
            });
            menuOptions.push({
              key: 'rejectToDelete',
              name: 'Reject to delete',
              children: (
                <>
                  <a>
                    <CloseOutlined />
                    {' '}
                    Reject To Delete
                  </a>
                </>
              ),
              onClick: async () => {
                const result = await window.confirm('Are you sure to reject the deletion?');
                if (result) {
                  try {
                    await performerService.update(id, { status: 'active' });
                    Router.reload();
                    message.success('Rejected!');
                  } catch (error) {
                    message.error('Something went wrong, please try again!');
                  }
                }
              },
              isDisabled
            });
          }
          return <DropdownAction menuOptions={menuOptions} />;
        }
      }
    ];
    return (
      <>
        <Head>
          <title>Escorts</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Escorts' }]} />
        <Page>
          <SearchFilter onSubmit={this.handleFilter.bind(this)} />
          <div style={{ marginBottom: '20px' }} />
          <Table
            dataSource={list}
            columns={columns}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default Performers;
