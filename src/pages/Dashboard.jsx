import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import StripeAccount from './StripeAccount';
import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

import {
  Statistic,
  Row,
  Col,
  Button,
  Divider,
  Typography,
  Select,
  Steps
} from 'antd';

const { Step } = Steps;
const { Title } = Typography;

const { Option } = Select;

const ACCOUNT_REPORT = gql`
  query AccountReport($username: String!) {
    account_report(where: { username: { _eq: $username } }) {
      events
      favorites
      id
      username
      name
      revenue
      subscriptions
      views
      account {
        stripe_id
        events {
          id
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
  let hasEvents = account?.account?.events?.length;
  let hasViews = account?.views;
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
            title="Bank Details"
            description={
              <React.Fragment>
                <div>Fill out your bank details to receive payments.</div>
                <StripeAccount id={account.id} username={username} />
              </React.Fragment>
            }
          />
          <Step
            title="Create Event"
            description={
              <React.Fragment>
                <div>Create your first event to sell</div>
                <Link to={`/${username}/manage/events/add?redirect=dashboard`}>
                  <Button>Create Event</Button>
                </Link>
              </React.Fragment>
            }
          />
          <Step
            title="Share Link"
            description="Share your event link on social media in order to sell tickets"
          />
          <Step
            title="Go Live!"
            description="If your event is a livestream, go live at the correct time!"
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
              <Statistic title="Subscriptions" value={account.subscriptions} />
            </Col>
            <Col span={4}>
              <Statistic title="Events" value={account.events} />
            </Col>
          </Row>

          <Select defaultValue="lucy" style={{ width: 120 }} allowClear>
            <Option value="lucy">Lucy</Option>
          </Select>
        </React.Fragment>
      )}

      <Divider />
    </React.Fragment>
  );
}
