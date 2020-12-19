import React from 'react';

import { Link } from 'react-router-dom';

import ShareButton from 'components/ShareButton';
import StripeAccount from 'pages/Account/StripeAccount';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import { Statistic, Row, Col, Button, Typography, Steps } from 'antd';

const { Step } = Steps;
const { Title } = Typography;

export default function DashboardView(props) {
  const {
    loading,
    error,
    stepsComplete,
    step,
    account,
    username,
    firstEventIsLive,
    firstEventLink,
    shareLink
  } = props;

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  return (
    <article className="min-h-page">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                  <div>
                    Provide your bank details or debit card to get paid.
                  </div>
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
                  {step === 3 && (
                    <div>
                      Share your event link on social media in order to sell
                      tickets
                      <br />
                      <ShareButton primary={true} url={shareLink} />
                    </div>
                  )}
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
      </div>
    </article>
  );
}
