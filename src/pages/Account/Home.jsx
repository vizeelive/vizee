import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';
import Events from '../../components/Events';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Content } = Layout;

const MainContent = styled(Content)`
  margin: 20px;
`;

const EventsContainer = styled.div`
  margin-top: 20px;
`;

const Social = styled.div`
  float: right;
  margin-right: 10px;
`;

export default function Home(props) {
  let { account, refetch } = props;
  return (
    <MainContent>
      <img
        style={{ objectFit: 'cover', height: '62vh' }}
        src={account.photo}
        alt={account.name}
        width="100%"
      />

      {account.instagram && (
        <Social>
          <a href={`https://instagram.com/${account.instagram}`}>
            <InstagramOutlined />
            {account.instagram}
          </a>
        </Social>
      )}
      {account.twitter && (
        <Social>
          <a href={`https://twitter.com/${account.twitter}`}>
            <TwitterOutlined /> {account.twitter}
          </a>
        </Social>
      )}
      {account.facebook && (
        <Social>
          <a href={`https://facebook.com/${account.facebook}`}>
            <FacebookOutlined /> {account.facebook}
          </a>
        </Social>
      )}

      <h1>{account.name}</h1>
      <Text type="secondary">{account.description}</Text>

      <EventsContainer>
        <h2>Events</h2>
        <Events events={account.events} refetch={refetch} />
      </EventsContainer>
    </MainContent>
  );
}
