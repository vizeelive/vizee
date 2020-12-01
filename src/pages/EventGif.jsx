import React from 'react';
import { useParams } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';

import Mapper from '../services/mapper';
import Countdown from '../components/Countdown';

import styled from 'styled-components';

const GET_EVENT_UNAUTH = gql`
  query AnonEventsReport($id: uuid!) {
    events_report(where: { id: { _eq: $id } }) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      video
      favorites
      views
      location
      account {
        id
        name
        username
        photo
        stripe_data
        umami_website
      }
    }
  }
`;

export default function Event() {
  const { id } = useParams();

  const { loading, data } = useQuery(GET_EVENT_UNAUTH, {
    variables: { id }
  });

  if (loading) return null;

  const event = Mapper({ ...data?.events_report?.[0] });

  const coverPhoto = (event.photo || event.account.photo).replace(
    'https://vizee-media.s3.amazonaws.com/',
    ''
  );

  const Content = styled.div`
    position: absolute;
    bottom: 0;
    color: white;
    font-size: 33px;
    padding-left: 40px;

    h1 {
      color: white;
    }
  `;

  return (
    <div>
      <img
        width="100%"
        alt={event.name || event?.account?.name}
        src={`https://vizee.imgix.net/${coverPhoto}?fit=fill&fill=blur&w=${window.innerWidth}&h=${window.innerHeight}`}
      />
      <Content>
        <h1>{event.name}</h1>
        <div>{event.description}</div>
        <Countdown date={event.start} />
      </Content>
    </div>
  );
}
