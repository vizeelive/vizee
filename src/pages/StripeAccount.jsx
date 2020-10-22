import React from 'react';
import config from '../config';
import { useParams } from 'react-router-dom';
import { Button, message } from 'antd';

import { gql, useQuery } from '@apollo/client';

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

const GET_ACCOUNT = gql`
  query GetAccount($id: uuid!) {
    accounts_by_pk(id: $id) {
      stripe_data
      stripe_id
      id
    }
  }
`;

export default function StripeAccount(props) {
  let { id, username, status } = useParams();

  id = props.id || id;
  username = props.username || username;

  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { id }
  });

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const account = data?.accounts_by_pk;
  const accountIsReady = account?.stripe_data?.details_submitted;

  const handleStripeConnect = async () => {
    try {
      let res = await fetch(
        `${config.api}/stripe/account/create?id=${id}&username=${username}`
      ).then((res) => res.json());
      window.location.replace(res.url);
    } catch (e) {
      message.error('An error occurred');
      console.log(e);
      throw e;
    }
  };

  const handleStripeDashboard = () => {
    window.open(
      `https://dashboard.stripe.com/${account.stripe_id}/test/dashboard`
    );
  };

  if (status === 'refresh') {
    handleStripeConnect();
  }

  return (
    <React.Fragment>
      {!accountIsReady && (
        <Button onClick={handleStripeConnect} type="primary">
          Connect to Stripe
        </Button>
      )}
      {accountIsReady && (
        <Button onClick={handleStripeDashboard} type="secondary">
          View Stripe Dashboard
        </Button>
      )}
    </React.Fragment>
  );
}
