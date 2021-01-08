import React from 'react';

import { Link } from 'react-router-dom';
import ShareButton from 'components/ShareButton';
import StripeAccount from 'pages/Account/StripeAccount';

import { Button, Steps } from 'antd';
const { Step } = Steps;

export default function DashboardSteps(props) {
  const {
    step,
    username,
    account,
    shareLink,
    firstEventIsLive,
    firstEventLink
  } = props;
  return (
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
              <Link to={`/${username}/manage/events/add?redirect=dashboard`}>
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
                Share your event link on social media in order to sell tickets
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
  );
}
