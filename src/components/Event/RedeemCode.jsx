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
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm lg:text-base font-medium text-gray-300 bg-black hover:bg-white-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
        onClick={() => setIsModalOpen(true)}
      >
        Redeem Code
      </button>
    </React.Fragment>
  );
}
