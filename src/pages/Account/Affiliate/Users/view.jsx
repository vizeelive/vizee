import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import {
  Badge,
  Button,
  Modal,
  Form,
  Select,
  Table,
  Popconfirm,
  Typography,
  Input
} from 'antd';

const { Option } = Select;
const { Title } = Typography;

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
    }
  }
`;

export default function UsersView(props) {
  const {
    form,
    loading,
    error,
    handleDeleteAccountUser,
    setShowModal,
    showModal,
    accountUsers,
    onFinish
  } = props;

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }
  if (error) return 'Error.';

  const getStatus = (status) => {
    switch (status) {
      case true:
        return <Badge color="green" text="Approved" />;
        break;
      case false:
        return <Badge color="red" text="Unappoved" />;
        break;
    }
  };

  const columns = [
    {
      title: 'email',
      dataIndex: ['email'],
      key: 'email'
    },
    {
      title: 'Date Added',
      dataIndex: 'created',
      key: 'created',
      render: (created) => {
        return moment(created).format('MMMM Do h:mm a');
      }
    },
    {
      title: 'status',
      dataIndex: ['approved'],
      key: 'approved',
      render: (status) => getStatus(status)
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'center',
      render: (accountUser) => {
        return (
          <React.Fragment>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => handleDeleteAccountUser(accountUser)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </React.Fragment>
        );
      }
    }
  ];

  return (
    <div>
      <Button
        type="primary"
        size="large"
        onClick={() => setShowModal(true)}
        className="float-right"
      >
        Add Affiliate
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={accountUsers}
        scroll={{ x: 800 }}
        className="pt-5"
      />

      <Modal
        title="Add User"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Form name="basic" form={form} onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input autoFocus={true} />
          </Form.Item>
          <Button key="submit" htmlType="submit" type="primary" size="large">
            Add Affiliate
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
