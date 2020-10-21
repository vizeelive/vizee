import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';

const SUBSCRIBE = gql`
  mutation Subscribe($account_id: uuid!) {
    insert_subscriptions_one(object: { account_id: $account_id }) {
      id
    }
  }
`;

const UNSUBSCRIBE = gql`
  mutation Unsubscribe($subscription_id: uuid!) {
    delete_subscriptions_by_pk(id: $subscription_id) {
      id
    }
  }
`;

export default function SubscribeButton(props) {
  const [subscriptionId, setSubscriptionId] = useState(props.subscription_id);
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);

  const handleSubscribe = async () => {
    try {
      let res = await subscribe({
        variables: { account_id: props.account_id }
      });
      setSubscriptionId(res.data.insert_subscriptions_one.id);
    } catch (e) {}
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe({
        variables: { subscription_id: subscriptionId }
      });
      setSubscriptionId(null);
    } catch (e) {}
  };

  return (
    <React.Fragment>
      {!subscriptionId && (
        <Button size="large" type="primary" onClick={handleSubscribe}>
          Subscribe
        </Button>
      )}
      {subscriptionId && (
        <Button size="large" onClick={handleUnsubscribe}>
          Unsubscribe
        </Button>
      )}
    </React.Fragment>
  );
}
