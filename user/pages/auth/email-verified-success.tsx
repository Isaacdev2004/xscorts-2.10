import { Layout, Button, Result } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import Router from 'next/router';
import './index.less';
import SeoMetaHead from '@components/common/seo-meta-head';

export default function EmailVerified() {
  return (
    <Layout>
      <SeoMetaHead item={{ title: 'Email verified' }} />
      <div className="main-container">
        <Result
          status="success"
          title="Email address verified"
          subTitle="Please wait while the Admin verifies your ID and activates your account."
          extra={[
            <Button className="secondary" key="console" onClick={() => Router.push('/home')}>
              <HomeOutlined />
              HOME
            </Button>,
            <Button key="buy" className="primary" onClick={() => Router.push('/auth/login')}>
              <LoginOutlined />
              LOG IN
            </Button>
          ]}
        />
      </div>
    </Layout>
  );
}
