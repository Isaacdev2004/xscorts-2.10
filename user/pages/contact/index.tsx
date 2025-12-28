/* eslint-disable react/no-danger */
import { PureComponent, createRef } from 'react';
import {
  ContactsOutlined
} from '@ant-design/icons';
import {
  Form, Button, Layout, Input, message, Col, Row
} from 'antd';
import { settingService } from '@services/setting.service';
import './index.less';
import SeoMetaHead from '@components/common/seo-meta-head';

const { TextArea } = Input;

class ContactPage extends PureComponent {
  static authenticate = true;

  static noredirect: boolean = true;

  _intervalCountdown: any;

  state = {
    submitting: false,
    countTime: 60,
    contact: null
  }

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
    this.loadPost();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.countTime === 0) {
      this._intervalCountdown && clearInterval(this._intervalCountdown);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ countTime: 60 });
    }
  }

  componentWillUnmount() {
    this._intervalCountdown && clearInterval(this._intervalCountdown);
  }

  async onFinish(values) {
    this.setState({ submitting: true });
    try {
      await settingService.contact(values);
      message.success('Email has been sent to your registered email address');
      this.handleCountdown();
      this.formRef.current.resetFields();
    } catch (e) {
      message.error('Error occurred, please try again later');
    } finally {
      this.setState({ submitting: false });
    }
  }

  handleCountdown = async () => {
    const { countTime } = this.state;
    if (countTime === 0) {
      clearInterval(this._intervalCountdown);
      this.setState({ countTime: 60 });
      return;
    }
    this.setState({ countTime: countTime - 1 });
    this._intervalCountdown = setInterval(this.countDown.bind(this), 1000);
  }

  countDown() {
    const { countTime } = this.state;
    this.setState({ countTime: countTime - 1 });
  }

  async loadPost() {
    const resp = await settingService.valueByKeys(['contactContent']);
    await this.setState({
      contact: resp.contactContent
    });
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const { submitting, countTime, contact } = this.state;
    return (
      <Layout>
        <SeoMetaHead pageTitle="Contact us" />
        <div className="main-container">
          <div className="page-heading">
            Contact
          </div>
          <Row>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
            >
              <div className="contact-content" dangerouslySetInnerHTML={{ __html: contact }} />
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
            >
              <div className="contact-form">
                <Form
                  layout="vertical"
                  name="contact-from"
                  ref={this.formRef}
                  onFinish={this.onFinish.bind(this)}
                >
                  <Form.Item>
                    <p className="text-center">
                      Please fill out all the info beside and we will get back to
                      you with-in 48hrs.
                    </p>
                  </Form.Item>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Tell us your name' }]}
                  >
                    <Input placeholder="Your name" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Tell us your e-mail address.'
                      },
                      { type: 'email', message: 'Invalid email format' }
                    ]}
                  >
                    <Input placeholder="Your email address" />
                  </Form.Item>
                  <Form.Item
                    name="message"
                    rules={[
                      { required: true, message: 'What can we help you?' },
                      {
                        min: 20,
                        message: 'Please input at least 20 characters.'
                      }
                    ]}
                  >
                    <TextArea minLength={20} maxLength={250} showCount rows={3} placeholder="Your message" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      size="large"
                      className="primary"
                      type="primary"
                      htmlType="submit"
                      loading={submitting || countTime < 60}
                      disabled={submitting || countTime < 60}
                      style={{ fontWeight: 600, width: '100%' }}
                    >
                      {countTime < 60 ? 'Resend in' : 'Send'}
                      {' '}
                      {countTime < 60 && `${countTime}s`}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Layout>
    );
  }
}

export default ContactPage;
