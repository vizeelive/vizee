import React from 'react';
import logger from 'logger';
import config from '../../config';
import { useParams } from 'react-router-dom';
import { Button, message } from 'antd';

import { gql, useQuery } from '@apollo/client';

import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';

const GET_ACCOUNT = gql`
  query GetAccount($id: uuid!, $username: String!) {
    accounts_by_pk(id: $id) {
      stripe_data
      stripe_id
      id
    }
    getStripeUrl(username: $username) {
      url
    }
  }
`;

export default function StripeAccount(props) {
  let { id, username, status } = useParams();

  id = props.id || id;
  username = props.username || username;

  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { id, username }
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
  const accountNotStarted = !account?.stripe_id;
  const accountNeedsFinish =
    account?.stripe_id && !account?.stripe_data?.details_submitted;
  const accountIsReady =
    account?.stripe_id && account?.stripe_data?.details_submitted;

  const handleStripeConnect = async () => {
    logger.info('Running handleStripeConnect');
    try {
      let res = await fetch(
        `${config.api}/stripe/account/create?id=${id}&username=${username}`
      ).then((res) => res.json());
      window.mixpanel.track('Stripe Connect Started');
      window.location.replace(res.url);
    } catch (e) {
      message.error('An error occurred');
      console.log(e);
      throw e;
    }
  };

  const handleStripeFinish = async () => {
    logger.info('Running handleStripeFinish');
    try {
      let res = await fetch(
        `${config.api}/stripe/account/create?account_id=${account.stripe_id}&username=${username}`
      ).then((res) => res.json());
      window.mixpanel.track('Stripe Connect Continued');
      window.location.replace(res.url);
    } catch (e) {
      message.error('An error occurred');
      console.log(e);
      throw e;
    }
  };

  const handleStripeDashboard = () => {
    window.open(data.getStripeUrl.url);
  };

  if (status === 'refresh') {
    handleStripeConnect();
  }

  return (
    <React.Fragment>
      {accountNotStarted && (
        <Button onClick={handleStripeConnect} type="primary">
          Connect to Stripe
        </Button>
      )}
      {accountNeedsFinish && (
        <Button onClick={handleStripeFinish} type="primary">
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
