import React from 'react';
import { gql, useMutation } from '@apollo/client';
import useAuth from '../hooks/useAuth';

import { Form, Input, Button, Modal, message } from 'antd';

const UPDATE_USER = gql`
  mutation UpdateUser($id: uuid!, $_set: users_set_input!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $_set) {
      last_name
      first_name
    }
  }
`;

export default function FinishSignup(props) {
  const { user } = useAuth();
  const [updateUser] = useMutation(UPDATE_USER);

  const onFinish = async (values) => {
    try {
      await updateUser({
        variables: {
          id: user.id,
          _set: {
            first_name: values.first_name,
            last_name: values.last_name
          }
        }
      });
      props.setShowModal(false);
    } catch (e) {
      message.error('Unknown error occurred');
    }
  };

  return (
    <Modal
      title="Let's complete your signup real quick"
      closable={false}
      visible={true}
      footer={null}
    >
      <Form name="basic" onFinish={onFinish}>
        <Form.Item
          autofocus
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>
        <Button key="submit" htmlType="submit" type="primary">
          OK
        </Button>
      </Form>
    </Modal>
  );
}
