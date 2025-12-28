import SeoForm from '@components/seo/SeoForm';
import { Breadcrumb, message } from 'antd';
import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { seoService } from '@services/seo.service';
import { useRouter } from 'next/router';
import Page from '@components/common/layout/page';

export default function SeoCreate() {
  const router = useRouter();
  const handleSubmit = async (value) => {
    try {
      await seoService.create(value);
      message.success('Create new SEO setting success!');
      router.push('/seo');
    } catch (error) {
      message.error('An error occurred. Please try again!');
    }
  };
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
          <Breadcrumb.Item>Create new SEO setting</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <SeoForm onFinish={handleSubmit} />
    </Page>
  );
}
