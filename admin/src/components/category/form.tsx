import { PureComponent } from 'react';
import {
  Form, Input, Button, Select
} from 'antd';
import { ICategory } from 'src/interfaces';

interface IProps {
  category?: ICategory;
  onFinish: Function;
  submitting: boolean;
}

export class FormCategory extends PureComponent<IProps> {
  render() {
    const { category, onFinish, submitting } = this.props;
    return (
      <Form
        onFinish={onFinish.bind(this)}
        initialValues={
          category || {
            group: '',
            name: '',
            ordering: 0,
            status: 'active',
            description: ''
          }
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name="group" label="Group">
          <Select>
            <Select.Option key="all" value="">
              All
            </Select.Option>
            <Select.Option key="performer" value="performer">
              Performer
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'please enter category name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Slug" name="slug" help="Unique, friendly URL. No space or special chars">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Meta Tile" name="metaTitle">
          <Input />
        </Form.Item>
        <Form.Item label="Meta Keywords" name="metaKeywords">
          <Input />
        </Form.Item>
        <Form.Item name="metaDescription" label="Meta Description" help="Maximum 160 characters" rules={[{ max: 160, message: 'Maximum 160 characters!' }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="canonicalUrl" label="Canonical URL">
          <Input />
        </Form.Item>
        {/* <Form.Item name="ordering" label="Ordering">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item> */}
        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
          <Select>
            <Select.Option key="active" value="active">
              Active
            </Select.Option>
            <Select.Option key="inactive" value="inactive">
              Inactive
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
