import { DropdownAction } from '@components/common';
import Page from '@components/common/layout/page';
import { formatDate } from '@lib/date';
import { message, Table } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { seoService } from '@services/seo.service';
import { ISEO } from 'src/interfaces/seo';

export default function SeoSetting() {
  const [data, setData] = useState({
    data: [],
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const limit = 1;

  const deleteItem = async (item) => {
    if (!window.confirm('Confirm to delete this item')) return;

    await seoService.delete(item._id);
    message.success('Item has been deleted!');

    const index = data.data.findIndex((d) => d._id === item._id);
    if (index > -1) {
      data.data.splice(index, 1);
      setData({
        ...data,
        data: [...data.data]
      });
    }
  };

  const handleLoadData = async (page = 1) => {
    // todo : handle pagination
    try {
      setLoading(true);
      const resp = await seoService.search({
        limit,
        offset: ((page || 1) - 1) * limit
      });
      setData(resp.data);
    } catch (error) {
      message.error('Error occurred, please try again!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Path',
      render: ({ path }: ISEO) => <div>{`${path}`}</div>,
      key: 'path'
    },
    {
      title: 'Meta Title',
      dataIndex: 'metaTitle',
      key: 'metaTitle'
    },
    {
      title: 'Meta Description',
      dataIndex: 'metaDescription',
      key: 'metaDescription'
    },
    {
      title: 'Meta Keywords',
      dataIndex: 'metaKeywords',
      key: 'metaKeywords'
    },
    {
      title: 'Canonical Url',
      dataIndex: 'canonicalUrl',
      key: 'canonicalUrl'
    },
    {
      title: 'Last update',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (_, record) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={{
                    pathname: '/seo/update',
                    query: { id: record._id }
                  }}
                  as={`/seo/update?id=${record._id}`}
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
              onClick: () => deleteItem(record)
            }
          ]}
        />
      )
    }
  ];

  const pageChange = (page) => {
    handleLoadData(page.current);
  };

  useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <>
      <Head>
        <title>SEO Settings</title>
      </Head>
      <Page>
        <Table
          dataSource={data.data}
          rowKey={(record) => record._id}
          columns={columns}
          loading={loading}
          pagination={{
            showSizeChanger: false,
            pageSize: 1,
            total: data.total
          }}
          onChange={pageChange}
        />
      </Page>
    </>
  );
}
