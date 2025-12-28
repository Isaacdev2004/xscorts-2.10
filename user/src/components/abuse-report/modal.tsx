import {
  ModalProps, Modal, Form, Select, Input
} from 'antd';
import React from 'react';

export interface AbuseReportModalProps extends ModalProps {
  onValuesChange: (changedValues: any, values: any) => void;
  form: any; // Nhận form từ props
}

const categories = {
  advertising: 'Model advertises',
  abusive: 'The model is behaving abusively',
  offline_payments: 'The model requests offline payments',
  other: 'Other'
};

export const AbuseReportModal = React.memo(
  ({ onValuesChange, form, ...props }: AbuseReportModalProps) => (
    <Modal {...props} className="report-modal">
      <Form
        form={form} // Sử dụng form từ props
        layout="vertical"
        initialValues={{
          category: 'abusive'
        }}
        onValuesChange={onValuesChange}
      >
        <Form.Item name="category" label="Choose a category">
          <Select style={{ width: '100%', padding: 0 }}>
            {Object.keys(categories).map((key) => (
              <Select.Option key={key} value={key}>
                {categories[key]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="comment" label="Additional comments:">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
);
