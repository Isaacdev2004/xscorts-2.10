import {
  Form,
  Input,
  Button,
  Layout,
  message,
  Row,
  Col
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { authService } from '@services/index';
import Link from 'next/link';
import { IUIConfig } from 'src/interfaces';
import './index.less';
import SeoMetaHead from '@components/common/seo-meta-head';

interface IProps {
  ui: IUIConfig;
  submitting: boolean;
}

class EmailVerification extends PureComponent<IProps> {
  static authenticate = false;

  static layout = 'primary';

  state = {
    loading: false,
    submitting: false
  }

  async handleResendEmail(email) {
    try {
      this.setState({ submitting: true });
      await authService.resendEmailVerification(email);
      message.success('Email has been sent to your registered email address');
    } catch (e) {
      message.error('Please type your message');
      this.setState({ submitting: false });
    }
  }

  render() {
    const { ui } = this.props;
    const { loading, submitting } = this.state;
    return (
      <Layout>
        <SeoMetaHead item={{ title: 'Resend email verification' }} />
        <div className="login-page">
          <div className="login-box">
            <div className="login-logo">
              <Link href="/home">
                <a>
                  {ui.logo ? <img alt="logo" src={ui.logo} /> : ui.siteName}
                </a>
              </Link>
            </div>
            <div className="login-form">
              <p className="title">
                Resend email verification
              </p>
              <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={this.handleResendEmail.bind(this)}
                layout="vertical"
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      name="email"
                      hasFeedback
                      label="Email"
                      rules={[
                        { required: true, message: 'Email is required' }
                      ]}
                    >
                      <Input type="email" placeholder="Enter your email address" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        loading={loading}
                        disabled={submitting}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Send
                      </Button>
                      <div className="link-path">
                        <a href="/auth/login">Login</a>
                        <a href="/auth/forgot-password">Forgot password</a>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui }
});
export default connect(mapStatesToProps)(EmailVerification) as any;
