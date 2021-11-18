import React, { useState } from 'react';
import { find } from 'lodash';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import useAuth from 'hooks/useAuth';

import { Form, message } from 'antd';

import UsersView from './view';

const GET_USERS = gql`
  query getAffiliates($account_id: uuid!) {
    affiliates: accounts_affiliates_owner(
      where: { account_id: { _eq: $account_id } }
    ) {
      id
      email
      approved
      user {
        email
        first_name
        last_name
      }
    }
  }
`;

const ADD_USER = gql`
  mutation addAffilateOwner($object: accounts_affiliates_owner_insert_input!) {
    insert_accounts_affiliates_owner_one(object: $object) {
      id
    }
  }
`;

const DELETE_ACCOUNTUSER = gql`
  mutation deleteAffiliate($id: uuid!) {
    delete_accounts_affiliates_owner(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

export default function Users({ account_id }) {
  const { user } = useAuth();
  let [form] = Form.useForm();
  let { username } = useParams();
  const [showModal, setShowModal] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { account_id }
  });

  const [addUser] = useMutation(ADD_USER);
  const [deleteAccountUser] = useMutation(DELETE_ACCOUNTUSER);

  let account, accountUsers, users, addableUsers;

  if (data) {
    accountUsers = data?.affiliates?.map((affiliate) => {
      return { ...affiliate, email: affiliate?.user?.email || affiliate.email };
    });
  }

  const onFinish = async (values) => {
    try {
      await addUser({
        variables: {
          object: {
            email: values.email.toLowerCase(),
            account_id,
            approved: true
          }
        }
      });
      window.mixpanel.track('User Added');
      message.success('Successfully added user');
      refetch();
      form.resetFields();
      setShowModal(false);
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
      form={form}
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
