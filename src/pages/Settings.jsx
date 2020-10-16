import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Tabs, Typography } from 'antd';
import styled from 'styled-components';

import { CreditCardOutlined, YoutubeOutlined } from '@ant-design/icons';

import AddAccount from './AddAccount';
import StripeAccount from './StripeAccount';

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

export default function Settings() {
  const { tab } = useParams();
  const history = useHistory();

  const handleOnChange = (val) => {
    history.push(`${val}`);
  };

  return (
    <React.Fragment>
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
          <AddAccount />
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
      </Tabs>
    </React.Fragment>
  );
}
