import React from 'react';
import styled from 'styled-components';

import AddAccount from '../pages/AddAccount';

const Content = styled.div`
  margin: 20px;
  min-height: calc(100vh - 64px);
`;

export default function CreateAccount() {
  return (
    <Content>
      <h1>Let's create an account.</h1>
      <AddAccount redirect="account" />
    </Content>
  );
}
