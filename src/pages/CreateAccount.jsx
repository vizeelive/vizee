import React from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";

import AddAccount from "../pages/AddAccount";

const Content = styled.div`
  margin: 20px;
`;

export default function CreateAccount() {
  const { user } = useAuth();
  return (
    <Content>
      <h1>Let's create an account.</h1>
      <AddAccount redirect="account" />
    </Content>
  );
}
