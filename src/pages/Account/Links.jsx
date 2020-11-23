import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import Linkify from 'react-linkify';

import styled from 'styled-components';
import {
  Typography,
  Card,
  Button,
  Switch,
  Modal,
  Form,
  Input,
  message,
  Popconfirm
} from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

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

const { Title } = Typography;

const LinkCard = styled(Card)`
  margin-bottom: 10px;
`;

const CardSwitch = styled(Switch)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const ActionsMenu = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;

  .anticon {
    margin-left: 10px;
  }
`;

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

export default function Links() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSwitchLoading, setIsSwitchLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_LINKS, {
    variables: { account_id: id }
  });
  const [createLink] = useMutation(CREATE_LINK);
  const [deleteLink] = useMutation(DELETE_LINK);
  const [updateLink] = useMutation(UPDATE_LINK);

  if (loading) return 'Loading...';
  if (error) return 'Error.';

  const links = data?.links;

  const onFinish = async (data) => {
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
    <React.Fragment>
      <Header>
        <Title level={3}>Links</Title>
        <Button type="primary" onClick={() => setShowModal(true)}>
          Add Link
        </Button>
      </Header>
      {links.map((link) => (
        <LinkCard>
          <CardSwitch
            loading={isSwitchLoading[link.id]}
            checked={link.enabled}
            onChange={(enabled) => handleToggleEnabled(link, enabled)}
          />
          <ActionsMenu>
            <EditOutlined onClick={() => handleClickEdit(link)} />
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => handleClickDelete(link.id)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>
          </ActionsMenu>
          <h4>{link.name}</h4>
          <h5>
            <Linkify>{link.link}</Linkify>
          </h5>
        </LinkCard>
      ))}

      <Modal
        title="Create Link"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Form.Item name="id"></Form.Item>
          <Form.Item
            label="Title"
            name="name"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Link"
            name="link"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="Enabled"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Button key="submit" htmlType="submit" type="primary" size="large">
            Save Link
          </Button>
        </Form>
      </Modal>
    </React.Fragment>
  );
}
