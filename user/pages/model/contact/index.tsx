import { PureComponent } from 'react';
import {
  Form, Button, Layout, Input, message, Col, Row
} from 'antd';
import { IUIConfig } from 'src/interfaces';
import './index.less';
import Router from 'next/router';
import { performerService } from '@services/performer.service';
import SeoMetaHead from '@components/common/seo-meta-head';

const { TextArea } = Input;

interface IProps {
  ui: IUIConfig;
  id: string;
  query: any;
}

class ContactPage extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect: boolean = true;

  state = {
    submitting: false
  }

  async onFinish(values) {
    const { query } = Router;
    const username = query.to;
    this.setState({ submitting: true });
    try {
      await performerService.contact(username, values);
      message.success('Your message has been sent successfully');
      setTimeout(() => {
        Router.back();
      }, 2000);
    } catch (e) {
      message.error('Error occurred, please try again later');
    } finally {
      this.setState({ submitting: false });
    }
  }

  render() {
    const { submitting } = this.state;
    return (
      <Layout>
        <SeoMetaHead item={{ title: 'Contact' }} />
        <h1 className="getInTouch">GET IN TOUCH</h1>
        <div className="contact-container">
          <Form
            layout="vertical"
            name="contact-form"
            onFinish={this.onFinish.bind(this)}
          >
            <Row>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Tell us your name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: 'Tell us your e-mail address.'
                    },
                    { type: 'email', message: 'Invalid email format' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="subject"
                  label="Subject"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="message"
                  label="Message"
                  rules={[
                    {
                      min: 20,
                      message: 'Please input at least 20 characters.'
                    },
                    {
                      required: true,
                      message: 'Please give message'
                    }
                  ]}
                >
                  <TextArea minLength={20} maxLength={250} showCount rows={3} />
                </Form.Item>
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              Submit
            </Button>
          </Form>
        </div>
      </Layout>
    );
  }
}

export default ContactPage;
