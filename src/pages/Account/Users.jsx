import React, { useState } from 'react';
import { find } from 'lodash';
import { useParams } from 'react-router-dom';
import {
  Button,
  Modal,
  Form,
  Select,
  message,
  Table,
  Popconfirm,
  Typography
} from 'antd';
import styled from 'styled-components';
import moment from 'moment';

import { gql, useQuery, useMutation } from '@apollo/client';

import useAuth from '../../hooks/useAuth';

import { UserAddOutlined } from '@ant-design/icons';

import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';

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

const GET_USERS = gql`
  query GetAccountUsers($username: String!) {
    accounts(where: { username: { _eq: $username } }) {
      id
      name
      username
      users {
        id
        user {
          id
          name
          last_name
          first_name
        }
      }
    }
    users(order_by: { name: asc }) {
      id
      name
      email
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($object: accounts_users_insert_input!) {
    insert_accounts_users_one(object: $object) {
      id
    }
  }
`;

const DELETE_ACCOUNTUSER = gql`
  mutation DeletAccountUser($id: uuid!) {
    delete_accounts_users_by_pk(id: $id) {
      id
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

export default function Users() {
  const { user } = useAuth();
  let { username } = useParams();
  const [showModal, setShowModal] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { username }
  });

  const [addUser] = useMutation(ADD_USER);
  const [deleteAccountUser] = useMutation(DELETE_ACCOUNTUSER);

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }
  if (error) return 'Error.';

  let account = data?.accounts?.[0];
  let accountUsers = account?.users.filter((u) => u.user.id !== user.sub);
  let users = data?.users;

  const addableUsers = users
    .filter((u) => u.name)
    .filter((u) => u.id !== user.sub)
    .filter((u) => !!!find(accountUsers, (au) => au.user.id === u.id));

  const onFinish = async (values) => {
    try {
      await addUser({
        variables: {
          object: { user_id: values.user_id, account_id: account.id }
        }
      });
      window.mixpanel.track('User Added');
      message.success('Successfully added user');
      setShowModal(false);
      refetch();
    } catch (e) {
      message.error('An error occurred');
      console.log(e);
    }
  };

  const handleDeleteAccountUser = async (accountUser) => {
    await deleteAccountUser({ variables: { id: accountUser.id } });
    refetch();
    message.success('Successfully deleted account user');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: ['user', 'name'],
      key: 'name'
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
