import React from "react";
import { Link } from "react-router-dom";
import { Popconfirm, Button, Table, message } from "antd";

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

import { gql, useQuery, useMutation } from "@apollo/client";

const GET_ACCOUNTS = gql`
  query MyQuery {
    accounts {
      id
      name
      username
      description
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation MyMutation($id: uuid!) {
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
      <Centered height="full">
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
      render: (account) => {
        console.log({ account });
        return <Link to={`/${account.username}`}>{account.name}</Link>;
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "id",
      render: (account) => {
        return (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDeleteAcount(account)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Button style={{ float: "right" }} type="primary">
        <Link to={"/admin/accounts/add"}>Create Account</Link>
      </Button>
      <h2>Accounts</h2>
      <Table rowKey="id" columns={columns} dataSource={tableData} />
    </React.Fragment>
  );
}
