import {
  Button, Form, Input
} from 'antd';
import React, { useState } from 'react';

interface Props{
  onFinish : any;
}
export default function PerformerDeleteRequest({ onFinish }:Props) {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (value) => {
    setIsLoading(true);
    const result = window.confirm('Are you sure you want to delete your account?');
    if (result) {
      await onFinish(value);
    }
    setIsLoading(false);
  };

  return (
    <Form
      name="nest-messages"
      className="request-delete-form"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Password"
        name="password"
        validateTrigger={['onChange', 'onBlur']}
        hasFeedback
        rules={[
          // {
          //   pattern: new RegExp(
          //     /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g
          //   ),
          //   message:
          //     'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
          // },
          { required: true, message: 'Please enter your password!' }
        ]}
      >
        <Input.Password placeholder="Password" className="ctl-input-password" />
      </Form.Item>
      {/* <Form.Item
        name="checkbox"
        valuePropName="checked"
        hasFeedback
        rules={[
          {
            validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms')))
          }
        ]}
      >
        <Checkbox>I agree to the terms and conditions</Checkbox>
      </Form.Item> */}
      <Form.Item>
        <Button className="btn-submit" htmlType="submit" loading={isLoading}>
          Request to delete
        </Button>
      </Form.Item>
    </Form>
  );
}
