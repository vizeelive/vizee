import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';
import Events from '../../components/Events';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const MainContent = styled(Content)`
  img {
    margin-bottom: 1rem;
  }
`;

const EventsContainer = styled.div`
  margin-top: 20px;
`;

const Social = styled.div`
  float: right;
  margin-right: 10px;
`;

const AccountDescription = styled.p`
  max-width: 40rem;
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

      <Title>
        {account.name}
      </Title>
      <AccountDescription>
        {account.description}
      </AccountDescription>

      <EventsContainer>
        <Title level={3}>Events</Title>
        <Events events={account.events} refetch={refetch} />
      </EventsContainer>
    </MainContent>
  );
}
