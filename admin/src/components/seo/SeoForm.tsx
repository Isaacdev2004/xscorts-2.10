/* eslint-disable react/require-default-props */
import {
  Button, Form, Input, message
} from 'antd';
import React, { useState } from 'react';
import { ISEO } from 'src/interfaces/seo';

interface Props {
  onFinish: any;
  defaultValue?: ISEO;
}
export default function SeoForm({ onFinish, defaultValue }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const handleCompleteForm = (value) => {
    try {
      setIsLoading(true);
      onFinish(value);
    } catch (error) {
      message.error('An error occurred. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form
      onFinish={handleCompleteForm}
      initialValues={defaultValue || {}}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please enter tile of the page!' }]}
        help="Name of this page"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Path"
        name="path"
        rules={[{ required: true, message: 'Please enter path of the page!' }]}
        help="Path should include / such as /search, /home"
      >
        <Input />
      </Form.Item>
      <Form.Item label="Meta Title" name="metaTitle">
        <Input />
      </Form.Item>
      <Form.Item label="Meta Keywords" name="metaKeywords">
        <Input />
      </Form.Item>
      <Form.Item
        name="metaDescription"
        label="Meta Description"
        rules={[{ max: 160, message: 'Maximum 160 Characters' }]}
        help="Maximum 160 Characters"
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Canonical Url" name="canonicalUrl">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" disabled={isLoading} loading={isLoading} style={{ float: 'right' }}>
        Submit
      </Button>
    </Form>
  );
}
