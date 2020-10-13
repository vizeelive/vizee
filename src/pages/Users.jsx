import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Layout,
  Button,
  Modal,
  Form,
  Select,
  message,
  Table,
  Popconfirm,
} from "antd";
import styled from "styled-components";
import moment from "moment";

import { gql, useQuery, useMutation } from "@apollo/client";

import useAuth from "../hooks/useAuth";

const { Content } = Layout;
const { Option } = Select;

const MainContent = styled(Content)`
  margin: 20px;
`;

const GET_USERS = gql`
  query GetUsers($user_id: String!, $username: String!) {
    myaccounts: accounts_users(where: { user_id: { _eq: $user_id } }) {
      account {
        id
        name
        username
      }
    }
    accounts_users(where: { account: { username: { _eq: $username } } }) {
      id
      created
      user {
        id
        name
        last_name
        first_name
      }
    }
    users {
      id
      name
      first_name
      last_name
    }
  }
`;

const GET_USERS_ADMIN = gql`
  query AdminGetUsers($username: String!) {
    myaccounts: accounts {
      id
      name
      username
    }
    accounts_users(where: { account: { username: { _eq: $username } } }) {
      id
      created
      user {
        id
        name
        last_name
        first_name
      }
    }
    users {
      id
      name
      first_name
      last_name
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

  let variables;
  if (!user.isAdmin) {
    variables = {
      user_id: user.sub,
      username: username,
    };
  } else {
    variables = {
      username: username,
    };
  }

  const { loading, error, data, refetch } = useQuery(
    user?.isAdmin ? GET_USERS_ADMIN : GET_USERS,
    {
      fetchPolicy: "cache-and-network",
      variables,
    }
  );
  const [addUser] = useMutation(ADD_USER);
  const [deleteAccountUser] = useMutation(DELETE_ACCOUNTUSER);

  if (loading) return "Loading...";
  if (error) return "Error.";

  let account;
  if (user.isAdmin) {
    account = data.myaccounts.filter((acc) => acc.username === username)[0];
  } else {
    account = data.myaccounts.filter(
      (acc) => acc.account.username === username
    );
  }

  const users = data?.users;
  const accountUsers = data?.accounts_users;

  const addableUsers = users.filter((user) => {
    let match = accountUsers.filter((accountUser) => {
      return accountUser.user.id === user.id;
    });
    return !match.length;
  });

  const onFinish = async (values) => {
    try {
      await addUser({
        variables: {
          object: { user_id: values.user_id, account_id: account.id },
        },
      });
      message.success("Successfully added user");
      setShowModal(false);
      refetch();
    } catch (e) {
      message.error("An error occurred");
      console.log(e);
    }
  };

  const handleDeleteAccountUser = async (accountUser) => {
    await deleteAccountUser({ variables: { id: accountUser.id } });
    refetch();
    message.success("Successfully deleted account user");
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: ["user", "first_name"],
      key: "username",
    },
    {
      title: "Last Name",
      dataIndex: ["user", "last_name"],
      key: "last_name",
    },
    {
      title: "Date Added",
      dataIndex: 'created',
      key: "created",
      render: (created) => {
        return moment(created).format("MMMM Do h:mm:ss a");
      },
    },
    {
      title: "Actions",
      key: "id",
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
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <MainContent>
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
                  {user.first_name} {user.last_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button key="submit" htmlType="submit" type="primary">
            Add
          </Button>
        </Form>
      </Modal>
      <Button
        style={{ float: "right" }}
        type="primary"
        onClick={() => setShowModal(true)}
      >
        Add Users
      </Button>
      <h2>Users</h2>
      <Table rowKey="id" columns={columns} dataSource={accountUsers} />
    </MainContent>
  );
}