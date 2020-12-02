import React from 'react';
import styled from 'styled-components';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';
import CurrencyInput from 'components/CurrencyInput';

import {
  Tabs,
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Popconfirm
} from 'antd';

const { TabPane } = Tabs;
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

export default function SubscriptionsView(props) {
  const {
    loading,
    error,
    setShowModal,
    tiers,
    handleDeleteTier,
    showModal,
    onFinish,
    form
  } = props;

  if (loading) {
    return (
      <Centered height="calc(100vh - 64px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

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
