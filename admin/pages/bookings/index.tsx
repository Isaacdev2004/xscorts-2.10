import React, { PureComponent } from 'react';
import './index.less';
import Head from 'next/head';
import { BreadcrumbComponent, DropdownAction } from '@components/common';
import { Table, message } from 'antd';
import Page from '@components/common/layout/page';
import { isEmpty, omitBy } from 'lodash';
import { bookingService } from '@services/booking.service';
import { getResponseError } from '@lib/utils';
import { EyeOutlined } from '@ant-design/icons';
import { IAbuseReport } from 'src/interfaces';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import BookingFilter from '@components/bookings/bookingFilters';
import moment from 'moment';
import { capitalizeFirstLetter } from '@lib/string';

interface IProps {}
interface IStates {
  loading: boolean;
  data: IAbuseReport[];
  pagination: {
    total: number;
    pageSize: number;
  };
  sort: {
    sortBy: string;
    sorter: string;
  };
  offset: number;
  query?: {};
  status?: string;
  filters: any;
}
const columns = [
  {
    title: 'Booker',
    key: 'booker',
    render(data, record: any) {
      return <span>{capitalizeFirstLetter(record?.sourceInfo?.username) || 'N/A'}</span>;
    }
  },
  {
    title: 'Escort',
    key: 'escort',
    render(data, record: any) {
      return (
        <span>
          {capitalizeFirstLetter(record?.targetInfo?.name) || 'N/A'}
          {' '}
          /
          {' '}
          {record?.targetInfo?.username}
        </span>
      );
    }
  },
  {
    title: 'Status',
    key: 'status',
    render(data, record: any) {
      return <span style={{ fontWeight: 'bold' }}>{capitalizeFirstLetter(record?.status) || 'N/A'}</span>;
    }
  },
  {
    title: 'Start At',
    dataIndex: 'startAt',
    key: 'startAt',
    sorter: true,
    render(date: Date) {
      return <span>{formatDate(date)}</span>;
    }
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    render(date: Date) {
      return <span>{formatDate(date)}</span>;
    }
  },
  {
    title: 'Actions',
    fixed: 'right' as 'right',
    render(data, record: any) {
      return (
        <DropdownAction
          menuOptions={[
            {
              key: 'view',
              name: 'View',
              children: (
                <Link
                  href={{
                    pathname: '/bookings/detail',
                    query: { id: record._id }
                  }}
                  as={`/bookings/detail?id=${record._id}`}
                >
                  <a>
                    <EyeOutlined />
                    {' '}
                    View
                  </a>
                </Link>
              )
            }
          ]}
        />
      );
    }
  }
];
export default class bookings extends PureComponent<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      offset: 0,
      pagination: {
        total: 0,
        pageSize: 10
      },
      sort: {
        sortBy: 'createdAt',
        sorter: 'desc'
      },
      filters: {}
    };
  }

  componentDidMount() {
    this.getList();
  }

  async handleFilter(values) {
    const { filters } = this.state;
    const startAt = values?.startAt ? moment().toISOString(values?.startAt) : null;
    const endAt = values?.endAt ? moment().toISOString(values?.endAt) : null;
    const cleanedFilters = omitBy(
      {
        ...filters,
        ...values,
        startAt,
        endAt
      },
      isEmpty
    );
    await this.setState({ filters: cleanedFilters });
    this.getList();
  }

  async onHandleTabChange(pgn, filters, sorter) {
    const { sort, pagination } = this.state;
    await this.setState({
      offset: (pgn.current - 1) * pagination.pageSize,
      sort: {
        ...sort,
        sortBy: sorter.field,
        sorter: sorter.order === 'ascend' ? 'asc' : 'desc'
      }
    });
    this.getList();
  }

  handleSearchPerformer = async (val) => {
    const { filters } = this.state;
    await this.setState({ filters: { ...filters, userId: val } });
    this.getList();
  };

  async getList() {
    const {
      offset, pagination, sort, filters
    } = this.state;
    try {
      this.setState({ loading: true });
      const resp = await bookingService.search({
        ...filters,
        sortBy: sort.sortBy || 'createdAt',
        sort: sort.sorter || 'desc',
        offset,
        limit: pagination.pageSize
      });
      await this.setState({
        data: resp.data.data,
        pagination: { ...pagination, total: resp.data.total }
      });
    } catch (e) {
      this.showError(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  async showError(e) {
    const err = await Promise.resolve(e);
    message.error(getResponseError(err));
  }

  render() {
    const { data, loading, pagination } = this.state;
    return (
      <>
        <Head>
          <title>Bookings</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Bookings' }]} />

        <Page>
          <BookingFilter onSubmit={this.handleFilter.bind(this)} />
          <div style={{ marginBottom: '20px' }} />
          {data ? (
            <>
              <Table
                columns={columns}
                rowKey="_id"
                dataSource={data}
                loading={loading}
                pagination={{ ...pagination, showSizeChanger: false }}
                onChange={this.onHandleTabChange.bind(this)}
                scroll={{ x: 700, y: 650 }}
              />
            </>
          ) : (
            <p>No report found.</p>
          )}
        </Page>
      </>
    );
  }
}
