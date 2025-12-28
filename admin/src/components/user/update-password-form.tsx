import React from 'react';
import { Form, Button, Input } from 'antd';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  updating: boolean;
}

export const UpdatePaswordForm = ({ onFinish, updating = false }: IProps) => (
  <Form name="nest-messages" onFinish={onFinish.bind(this)} {...layout}>
    <Form.Item
      name="password"
      label="Password"
      validateTrigger={['onChange', 'onBlur']}
      hasFeedback
      rules={[
        { required: true, message: 'Please input your password!' },
        {
          pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
          message: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
        }
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
      <Button type="primary" htmlType="submit" loading={updating}>
        Update
      </Button>
    </Form.Item>
  </Form>
);
