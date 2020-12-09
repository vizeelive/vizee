import React, { useState } from 'react';
import { Button, Modal, message, Form, Input } from 'antd';
import { gql, useMutation } from '@apollo/client';

const REDEEM_CODE = gql`
  mutation RedeemCode($id: uuid!, $user_id: uuid!, $claimed: timestamptz) {
    update_access_codes_by_pk(
      pk_columns: { id: $id }
      _set: { user_id: $user_id, claimed: $claimed }
    ) {
      id
    }
  }
`;
export default function RedeemCode(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redeemCode, { loading }] = useMutation(REDEEM_CODE);

  const onFinish = async (values) => {
    try {
      let res = await redeemCode({
        variables: {
          id: values.code,
          user_id: props.user_id,
          claimed: new Date()
        }
      });
      if (res?.data?.update_access_codes_by_pk?.id) {
        message.success('Successfully redeemed code');
        setIsModalOpen(false);
      } else {
        message.error('This code has already been redeemed');
      }
    } catch (e) {
      message.error('An error occurred');
      throw e;
    }
  };

  return (
    <React.Fragment>
      <Modal
        title="Redeem Code"
        visible={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form name="basic" onFinish={onFinish}>
          <Form.Item
            autofocus
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Redeem
          </Button>
        </Form>
      </Modal>
      <Button size="large" onClick={() => setIsModalOpen(true)}>
        Redeem Code
      </Button>
    </React.Fragment>
  );
}
