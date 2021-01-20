import config from 'config';
import React, { useState } from 'react';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Spinner from 'components/ui/Spinner';
import CurrencyInput from 'components/CurrencyInput';
import { Centered } from 'components/styled/common';
import {
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm
} from 'antd';

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

const GET_ACCOUNT_SHOPIFY = gql`
  query getAccountShopify($account_id: uuid!) {
    account: accounts_by_pk(id: $account_id) {
      shopify_domain
      shopify_storefront_token
    }
  }
`;

export default function Store(props) {
  const [form] = Form.useForm();
  const { id: account_id, username, status } = useParams();
  const [showModal, setShowModal] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_ACCOUNT_SHOPIFY, {
    variables: { account_id }
  });

  if (loading) {
    return (
      <Centered height="calc(100vh - 184px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const handleLink = ({ values }) => {
    let redirect = config.api + '/shopify/callback';
    let state = JSON.stringify({
      account_id,
      url: `/${username}/manage/store/${account_id}/success`
    });
    window.location.href = `https://${values.url}.myshopify.com/admin/oauth/authorize?client_id=${process.env.REACT_APP_SHOPIFY_CLIENT_ID}&scope=unauthenticated_read_product_listings,unauthenticated_write_checkouts,unauthenticated_write_customers,unauthenticated_read_customer_tags,unauthenticated_read_content,unauthenticated_read_product_tags&redirect_uri=${redirect}&state=${state}`;
  };

  return (
    <article className="min-h-page">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Header>
          <Title level={3}>Store</Title>
          <Button type="primary" onClick={() => setShowModal(true)}>
            Link Shopify
          </Button>
        </Header>
        {data.account.shopify_storefront_token && (
          <Card>
            Shopify Domain:{' '}
            <a href={`https://${data.account.shopify_domain}`}>
              {data.account.shopify_domain}
            </a>
          </Card>
        )}
      </div>
      <Modal
        title="Link Store"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Form
          name="basic"
          onFinish={(values) => handleLink({ values })}
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Shopify Domain"
            name="url"
            rules={[{ required: true, type: 'string', message: 'Required' }]}
          >
            <Input
              addonBefore="https://"
              addonAfter=".myshopify.com"
              defaultValue="mystore"
            />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large">
            Link
          </Button>
        </Form>
      </Modal>
    </article>
  );
}
