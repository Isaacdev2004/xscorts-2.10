import { Breadcrumb, message, Spin } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import SeoForm from '@components/seo/SeoForm';
import { useRouter } from 'next/router';
import { seoService } from '@services/seo.service';
import Page from '@components/common/layout/page';

interface Props{
  id: string;
}
export default function SEOUpdate({ id }:Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (value) => {
    try {
      await seoService.update(id, value);
      message.success('Update SEO setting success!');
      router.push('/seo');
    } catch (error) {
      message.error('An error occurred. Please try again!');
    }
  };
  const getInitialValue = async () => {
    try {
      setLoading(true);
      const res = await seoService.findById(id);
      setData(res.data);
    } catch (error) {
      message.error('An error occurred. Please try again!');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getInitialValue();
  }, []);

  return (
    <Page>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/seo" as="/seo">
              <a>SEO</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item />
        </Breadcrumb>
      </div>
      {loading ? <Spin /> : <SeoForm onFinish={handleSubmit} defaultValue={data} />}
    </Page>
  );
}
SEOUpdate.getInitialProps = async ({ ctx }) => {
  const { query } = ctx;
  return { id: query.id };
};
