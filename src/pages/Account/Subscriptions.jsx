import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Tabs,
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Popconfirm
} from 'antd';
import styled from 'styled-components';
import { gql, useQuery, useMutation } from '@apollo/client';

import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';

import CurrencyInput from '../../components/CurrencyInput';

const { TabPane } = Tabs;
const { Title } = Typography;

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

export default function Settings() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [createTier] = useMutation(CREATE_TIER);
  const [deleteTier] = useMutation(DELETE_TIER);
  const { loading, error, data, refetch } = useQuery(GET_DATA, {
    variables: { id }
  });

  if (loading) {
    return (
      <Centered height="calc(100vh - 64px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const tiers = data?.accounts_by_pk?.tiers;

  const onFinish = async (data) => {
    data.account_id = id;
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
    <React.Fragment>
      <Header>
        <Title level={3}>Subscriptions</Title>
      </Header>
      <Tabs>
        <TabPane tab={<span>Tiers</span>} key="account">
          <React.Fragment>
            <Button type="primary" onClick={() => setShowModal(true)}>
              Add Tier
            </Button>
            <br />
            <br />
            {tiers.map((tier) => (
              <Card>
                <Row>
                  <Col span={6}>
                    <b>{tier.name}</b>
                  </Col>
                  <Col span={6}>{tier.price}</Col>
                  <Col span={6}>{tier.description}</Col>
                  <Col span={6}>
                    <Popconfirm
                      title="Are you sure?"
                      onConfirm={() => handleDeleteTier(tier.id)}
                      onCancel={() => {}}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Card>
            ))}
          </React.Fragment>
        </TabPane>
        <TabPane tab={<span>Subscribers</span>} key="payment">
          {/* <StripeAccount /> */}
        </TabPane>
      </Tabs>
      <Modal
        title="Create Tier"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Required' }]}
          >
            <CurrencyInput
              className="ant-input"
              style={{ maxWidth: '10rem' }}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Button key="submit" htmlType="submit" type="primary" size="large">
            Add Tier
          </Button>
        </Form>
      </Modal>
    </React.Fragment>
  );
}
