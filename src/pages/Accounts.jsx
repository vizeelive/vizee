import React from "react";
import { Link } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import styled from 'styled-components';

import { Centered } from "../components/styled/common";
import Spinner from "../components/ui/Spinner";

import { UserOutlined } from "@ant-design/icons";

import {
  Typography,
  Popconfirm,
  Button,
  Table,
  message
} from "antd";

const { Title } = Typography;

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      margin: 0;
    }
  }
`;

const Actions = styled.div`
  > * {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

const Description = styled.span`
  display: block;
  max-width: 40rem;
`;

const GET_ACCOUNTS = gql`
  query GetAccount {
    accounts {
      id
      name
      username
      description
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($id: uuid!) {
    delete_accounts_by_pk(id: $id) {
      id
    }
  }
`;

export default function Events() {
  const { loading, error, data, refetch } = useQuery(GET_ACCOUNTS, {
    fetchPolicy: "cache-and-network",
  });
  const [deleteAccount] = useMutation(DELETE_ACCOUNT);

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return "Error.";

  let tableData = data.accounts.map((account) => {
    return {
      ...account,
      account: account.name,
    };
  });

  const handleDeleteAcount = async (account) => {
    try {
      await deleteAccount({ variables: { id: account.id } });
      refetch();
    } catch (e) {
      if (e.message.includes("Foreign key violation")) {
        message.error("Unable to delete due to dependent records");
      }
    }
  };

  const columns = [
    {
      title: "Account Name",
      key: "name",
      width: 240,
      render: (account) => {
        return <Link to={`/${account.username}`}>{account.name}</Link>;
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 240,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Description>{text}</Description>
      )
    },
    {
      title: "Actions",
      key: "id",
      align: 'center',
      width: 180,
      render: (account) => {
        return (
          <Actions>
            <Link to={`/admin/accounts/edit/${account.id}`}>
              <Button>Edit</Button>
            </Link>

            <Popconfirm
              title="Are you sure?"
              onConfirm={() => handleDeleteAcount(account)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>
                Delete
              </Button>
            </Popconfirm>
          </Actions>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Header>
        <Title level={2}>Accounts</Title>
        <Link to={"/admin/accounts/add"}>
          <Button
            icon={<UserOutlined />}
            type="primary"
            size="large"
          >
            Create Account
          </Button>
        </Link>
      </Header>
      
      <Table
        rowKey="id"
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1200 }}
      />
    </React.Fragment>
  );
}
