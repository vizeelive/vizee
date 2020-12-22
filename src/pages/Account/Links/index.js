import React, { useState } from 'react';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

import { Form, message } from 'antd';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import LinksView from './view';

const GET_LINKS = gql`
  query GetLinks($account_id: uuid!) {
    links(
      where: { account_id: { _eq: $account_id } }
      order_by: { created: asc }
    ) {
      id
      name
      link
      enabled
    }
  }
`;

const CREATE_LINK = gql`
  mutation CreateLink($object: links_insert_input!) {
    insert_links_one(object: $object) {
      id
    }
  }
`;

const UPDATE_LINK = gql`
  mutation UpdateLink($id: uuid!, $_set: links_set_input!) {
    update_links_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      enabled
    }
  }
`;

const DELETE_LINK = gql`
  mutation DeleteLink($id: uuid!) {
    delete_links_by_pk(id: $id) {
      id
    }
  }
`;

export default function Links() {
  const { id } = useParams();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isSwitchLoading, setIsSwitchLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_LINKS, {
    variables: { account_id: id }
  });
  const [createLink] = useMutation(CREATE_LINK);
  const [deleteLink] = useMutation(DELETE_LINK);
  const [updateLink] = useMutation(UPDATE_LINK);

  if (loading) {
    return (
      <Centered height="calc(100vh - 184px)">
        <Spinner />
      </Centered>
    );
  }
  if (error) return 'Error.';

  const links = data?.links;

  const onFinish = async (data) => {
    if (user?.isAdmin) {
      data.created_by = user.id;
    }
    if (data.id) {
      let _set = { ...data };
      delete _set.id;
      try {
        await updateLink({
          variables: {
            id: data.id,
            _set
          }
        });
        message.success('Successfully updated link');
        form.resetFields();
        setShowModal(false);
        refetch();
      } catch (e) {
        message.error('An error occurred');
        throw e;
      }
    } else {
      data.account_id = id;
      try {
        await createLink({
          variables: {
            object: data
          }
        });
        message.success('Successfully created link');
        form.resetFields();
        setShowModal(false);
        refetch();
      } catch (e) {
        message.error('An error occurred');
        throw e;
      }
    }
    setIsSwitchLoading({ ...isSwitchLoading, [data.id]: false });
  };

  const handleClickDelete = async (id) => {
    try {
      await deleteLink({ variables: { id } });
      refetch();
    } catch (e) {
      message.error('An error occurred');
      throw e;
    }
  };

  const handleClickEdit = (link) => {
    form.setFieldsValue(link);
    setShowModal(true);
  };

  const handleToggleEnabled = (link, enabled) => {
    setIsSwitchLoading({ ...isSwitchLoading, [link.id]: true });
    let data = { id: link.id, enabled };
    onFinish(data);
  };

  return (
    <LinksView
      showModal={showModal}
      setShowModal={setShowModal}
      links={links}
      isSwitchLoading={isSwitchLoading}
      handleToggleEnabled={handleToggleEnabled}
      handleClickEdit={handleClickEdit}
      handleClickDelete={handleClickDelete}
      onFinish={onFinish}
      form={form}
    />
  );
}
