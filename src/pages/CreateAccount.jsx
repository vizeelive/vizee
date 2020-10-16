import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';

import AddAccount from '../pages/AddAccount';

const Content = styled.div`
  margin: 20px;
  min-height: calc(100vh - 64px);
`;

const CreateMessage = styled(Typography.Title)`
  font-weight: 500 !important;
`;

export default function CreateAccount() {
  return (
    <Content>
      <CreateMessage level={3}>Let's create an account.</CreateMessage>
      <AddAccount redirect="account" />
    </Content>
  );
}
