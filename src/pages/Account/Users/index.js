import React, { useState } from 'react';
import { find } from 'lodash';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import useAuth from 'hooks/useAuth';

import { message } from 'antd';

import UsersView from './view';

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

  let account, accountUsers, users, addableUsers;

  if (data) {
    account = data?.accounts?.[0];
    accountUsers = account?.users.filter((u) => u.user.id !== user.id);
    users = data?.users;

    addableUsers = users
      .filter((u) => u.email)
      .filter((u) => u.id !== user.id)
      .filter((u) => !!!find(accountUsers, (au) => au.user.id === u.id));
  }

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

  return (
    <UsersView
      loading={loading}
      error={error}
      handleDeleteAccountUser={handleDeleteAccountUser}
      setShowModal={setShowModal}
      showModal={showModal}
      accountUsers={accountUsers}
      onFinish={onFinish}
      addableUsers={addableUsers}
    />
  );
}
