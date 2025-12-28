/* eslint-disable  no-nested-ternary */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Table, message, Input
} from 'antd';
import Page from '@components/common/layout/page';
import { formatDate } from '@lib/date';
import { BreadcrumbComponent } from '@components/common';
import { blockUserService } from '@services/block-user.service';

function BlockUser() {
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const limit = 10;
  const [searchKey, setSearchKey] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filter] = useState({});
  const [sorterBy, setSorterBy] = useState('');
  const [sort, setSort] = useState('');
  const columns = [
    {
      title: 'Model Name',
      dataIndex: 'modelname',
      key: 'modelname'
    },
    {
      title: 'Blocked Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'BlockedAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (createdAt: Date) => <span>{formatDate(createdAt)}</span>
    }
  ];
  const fetchingData = async (page = 1) => {
    setLoading(true);
    try {
      const resp = await blockUserService.search({
        limit,
        offset: (page - 1) * limit
      });
      setListData(resp.data.data);
    } catch (error) {
      message.error('Error occurred, please try again!');
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchingData();
  }, []);
  const dataSource = listData.map((p) => ({
    createdAt: p.createdAt,
    key: p._id,
    modelname: p.sourceInfo.username,
    username: p.targetInfo.username
  }));
  const saveKey = (value) => {
    setSearchKey(value);
  };
  const handleSearchSorter = async (page = 1) => {
    setLoading(true);
    try {
      const resp = await blockUserService.search({
        limit,
        offset: (page - 1) * limit,
        filter,
        sort,
        sorterBy
      });
      setListData(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (error) {
      message.error('Error occurred, please try again!');
    }
    setLoading(false);
  };
  const handleSearch = async () => {
    setLoading(true);
    try {
      const resp = await blockUserService.search({
        q: searchKey
      });
      setListData(resp.data.data);
    } catch (error) {
      message.error('Error occurred, please try again!');
    }
    setLoading(false);
  };
  const handleTableChange = async (pag, filters, sorter) => {
    const pager = { ...pag };
    pager.current = pag.current;
    setPagination(pager);
    setSorterBy(sorter.field || '');
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '');
    handleSearchSorter(pager.current);
  };
  return (
    <>
      <Head>
        <title>Blocked</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Blocked' }]} />
      <Page>
        <Input
          style={{ width: '50%' }}
          placeholder="Enter model name or username for search"
          onChange={(evt) => saveKey(evt.target.value)}
          onPressEnter={() => handleSearch()}
        />
        <div style={{ marginBottom: '20px' }} />
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ ...pagination, showSizeChanger: false }}
          onChange={handleTableChange.bind(this)}
        />
      </Page>
    </>
  );
}
export default BlockUser;
