import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useErrorHandler } from 'react-error-boundary';

import DashboardView from './view';

const ACCOUNT_REPORT = gql`
  query AccountReport($username: String!) {
    account_report(where: { username: { _eq: $username } }) {
      id
      username
      name
      revenue
      favoritecount
      eventcount
      followercount
      viewcount
      account {
        stripe_id
        events {
          id
          type
          name
          mux_id
        }
      }
    }
  }
`;

export default function Dashboard() {
  let { username } = useParams();
  const handleError = useErrorHandler();

  const { loading, error, data } = useQuery(ACCOUNT_REPORT, {
    variables: { username }
  });

  if (error) {
    handleError(error);
  }

  const account = data?.account_report?.[0];

  let step = 1;
  let bankSetup = account?.account?.stripe_id;
  let hasEvents = account?.eventcount;
  let hasViews = account?.viewcount;
  let eventComplete = account?.account?.events?.filter(
    (event) => event.type === 'video' || event.mux_id
  ).length;

  if (bankSetup) {
    step++;
    if (hasEvents) {
      step++;
      if (hasViews) {
        step++;
        if (eventComplete) {
          step++;
        }
      }
    }
  }

  let stepsComplete = step === 5 && eventComplete;
  let firstEventIsLive = account?.account?.events?.[0]?.type === 'live';
  let firstEventLink = `/${username}/${account?.account?.events?.[0]?.id}`;
  let shareLink = `${window.location.origin}${firstEventLink}`;

  return (
    <DashboardView
      loading={loading}
      error={error}
      stepsComplete={stepsComplete}
      step={step}
      account={account}
      username={username}
      firstEventLink={firstEventLink}
      firstEventIsLive={firstEventIsLive}
      shareLink={shareLink}
    />
  );
}
