import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import ShareButton from '../../components/ShareButton';
import StripeAccount from './StripeAccount';
import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';

import { Statistic, Row, Col, Button, Divider, Typography, Steps } from 'antd';

const { Step } = Steps;
const { Title } = Typography;

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
          video
          mux_id
        }
      }
    }
  }
`;

export default function Dashboard() {
  let { username } = useParams();

  const { loading, error, data } = useQuery(ACCOUNT_REPORT, {
    variables: { username }
  });

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const account = data?.account_report?.[0];

  let step = 1;
  let bankSetup = account?.account?.stripe_id;
  let hasEvents = account?.eventcount;
  let hasViews = account?.viewcount;
  let eventComplete = account?.account?.events?.filter(
    (event) => event.video || event.mux_id
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
    <React.Fragment>
      <Title>{account.name}</Title>

      {!stepsComplete && (
        <Steps direction="vertical" size="small" current={step}>
          <Step
            title="Create account"
            description="Your account has been successfully created."
          />
          <Step
            title="Payout"
            description={
              <React.Fragment>
                <div>Provide your bank details or debit card to get paid.</div>
                {step === 1 && (
                  <StripeAccount id={account.id} username={username} />
                )}
              </React.Fragment>
            }
          />
          <Step
            title="Create Event"
            description={
              <React.Fragment>
                <div>Create your first event to sell</div>
                {step === 2 && (
                  <Link
                    to={`/${username}/manage/events/add?redirect=dashboard`}
                  >
                    <Button type="primary">Create Event</Button>
                  </Link>
                )}
              </React.Fragment>
            }
          />
          <Step
            title="Share Link"
            description={
              <React.Fragment>
                <div>
                  Share your event link on social media in order to sell tickets
                </div>
                <ShareButton primary={true} url={shareLink} />
              </React.Fragment>
            }
          />
          <Step
            title="Go Live!"
            description={
              <React.Fragment>
                <div>
                  If your event is a livestream, go live at the correct time!
                </div>
                {step === 4 && firstEventIsLive && (
                  <Link to={firstEventLink}>
                    <Button type="primary">View Event</Button>
                  </Link>
                )}
              </React.Fragment>
            }
          />
        </Steps>
      )}

      {stepsComplete && (
        <React.Fragment>
          <Row gutter={16}>
            <Col span={4}>
              <Statistic
                title="Revenue"
                value={account.revenue}
                precision={2}
              />
            </Col>
            <Col span={4}>
              <Statistic title="Views" value={account.views} />
            </Col>
            <Col span={4}>
              <Statistic title="Favorites" value={account.favorites} />
            </Col>
            <Col span={4}>
              <Statistic title="Followers" value={account.followers} />
            </Col>
            <Col span={4}>
              <Statistic title="Events" value={account.events} />
            </Col>
          </Row>
        </React.Fragment>
      )}

      <Divider />
    </React.Fragment>
  );
}
