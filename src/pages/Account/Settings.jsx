import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Button, Tabs, Typography, Select, message } from 'antd';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';

import {
  CreditCardOutlined,
  YoutubeOutlined,
  UserOutlined
} from '@ant-design/icons';

import AddAccount from '../AddAccount';
import StripeAccount from './StripeAccount';
import useAuth from 'hooks/useAuth';

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

const UPDATE_PAYOUT_ACCOUNT = gql`
  mutation updatePayoutAccount($id: uuid!, $payout_account_id: uuid!) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { payout_account_id: $payout_account_id }
    ) {
      id
    }
  }
`;

export default function Settings({ accounts, payout_account_id }) {
  const { tab } = useParams();
  const history = useHistory();
  const { user } = useAuth();

  const [updatePayoutAccount] = useMutation(UPDATE_PAYOUT_ACCOUNT);

  const handleProfileUpdate = async (values) => {
    try {
      await updatePayoutAccount({
        variables: {
          id: user.id,
          payout_account_id: values.payout_account_id
        }
      });
      message.success('Payout account updated');
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleOnChange = (val) => {
    history.push(`${val}`);
  };

  return (
    <article data-test-id="account-settings" className="min-h-page">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Header>
          <Title>Settings</Title>
        </Header>
        <Tabs defaultActiveKey={tab} onChange={handleOnChange}>
          <TabPane
            tab={
              <span>
                <YoutubeOutlined /> Account
              </span>
            }
            key="account"
          >
            <AddAccount redirect={true} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <CreditCardOutlined /> Payment
              </span>
            }
            key="payment"
          >
            <StripeAccount />
          </TabPane>
          <TabPane
            tab={
              <span>
                <UserOutlined /> Profile
              </span>
            }
            key="user"
            className="p-5 space-y-3"
          >
            <div className="text-md">Payout Account</div>
            <div className="text-gray-700">
              Please choose the destination account where you would like payouts
              made to you
            </div>
            <Form
              initialValues={{ payout_account_id }}
              onFinish={handleProfileUpdate}
            >
              <Form.Item name="payout_account_id">
                <Select
                  style={{ width: 220 }}
                  options={accounts.map((a) => {
                    return {
                      value: a.id,
                      label: a.name
                    };
                  })}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </article>
  );
}
