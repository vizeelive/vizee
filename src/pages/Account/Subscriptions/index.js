import React, { useState } from 'react';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';

import { gql, useQuery, useMutation } from '@apollo/client';

import { Form, message } from 'antd';

import SubscriptionsView from './view';

const CREATE_TIER = gql`
  mutation CreateTier($object: tiers_insert_input!) {
    insert_tiers_one(object: $object) {
      id
    }
  }
`;

const GET_DATA = gql`
  query SubscriptionPageData($id: uuid!) {
    accounts_by_pk(id: $id) {
      tiers {
        id
        name
        price
        description
      }
    }
  }
`;

const DELETE_TIER = gql`
  mutation DeleteTier($id: uuid!) {
    delete_tiers_by_pk(id: $id) {
      id
    }
  }
`;

export default function Settings() {
  const { id } = useParams();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [createTier] = useMutation(CREATE_TIER);
  const [deleteTier] = useMutation(DELETE_TIER);
  const { loading, error, data, refetch } = useQuery(GET_DATA, {
    variables: { id }
  });

  const tiers = data?.accounts_by_pk?.tiers;

  const onFinish = async (data) => {
    data.account_id = id;
    if (user?.isAdmin) {
      data.created_by = user.id;
    }
    try {
      await createTier({
        variables: {
          object: data
        }
      });
      message.success('Successfully created tier');
      form.resetFields();
      setShowModal(false);
      refetch();
    } catch (e) {
      message.error('An error occurred');
      throw e;
    }
  };

  const handleDeleteTier = async (id) => {
    try {
      await deleteTier({ variables: { id } });
      refetch();
    } catch (e) {
      message.error('An error occurred');
      throw e;
    }
  };

  return (
    <SubscriptionsView
      loading={loading}
      error={error}
      setShowModal={setShowModal}
      tiers={tiers}
      handleDeleteTier={handleDeleteTier}
      showModal={showModal}
      onFinish={onFinish}
      form={form}
    />
  );
}
