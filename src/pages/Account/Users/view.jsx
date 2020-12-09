import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { UserAddOutlined } from '@ant-design/icons';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import {
  Button,
  Modal,
  Form,
  Select,
  Table,
  Popconfirm,
  Typography
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
    loading,
    error,
    handleDeleteAccountUser,
    setShowModal,
    showModal,
    accountUsers,
    onFinish,
    addableUsers
  } = props;

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }
  if (error) return 'Error.';

  const columns = [
    {
      title: 'email',
      dataIndex: ['user', 'email'],
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
    <React.Fragment>
      <Header>
        <Title>Users</Title>
        <Button
          type="primary"
          size="large"
          onClick={() => setShowModal(true)}
          icon={<UserAddOutlined />}
        >
          Add Users
        </Button>
      </Header>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={accountUsers}
        scroll={{ x: 800 }}
      />

      <Modal
        title="Add User"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Form name="basic" onFinish={onFinish}>
          <Form.Item name="user_id" label="User">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a user"
            >
              {addableUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button key="submit" htmlType="submit" type="primary" size="large">
            Add User
          </Button>
        </Form>
      </Modal>
    </React.Fragment>
  );
}
