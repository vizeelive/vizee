import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import Button from 'components/ui/Button';

const FOLLOW = gql`
  mutation Follow($account_id: uuid!) {
    insert_followers_one(object: { account_id: $account_id }) {
      id
    }
  }
`;

const UNFOLLOW = gql`
  mutation Unfollow($follower_id: uuid!) {
    delete_followers_by_pk(id: $follower_id) {
      id
    }
  }
`;

export default function FollowButton(props) {
  const [followerId, setFollowerId] = useState(props.follower_id);
  const [follow] = useMutation(FOLLOW);
  const [unfollow] = useMutation(UNFOLLOW);

  const handleFollow = async () => {
    try {
      let res = await follow({
        variables: { account_id: props.account_id }
      });
      setFollowerId(res.data.insert_followers_one.id);
      window.mixpanel.track('Account Followed');
    } catch (e) {}
  };

  const handleUnfollow = async () => {
    try {
      await unfollow({
        variables: { follower_id: followerId }
      });
      setFollowerId(null);
      window.mixpanel.track('Account Unfollowed');
    } catch (e) {}
  };

  return (
    <React.Fragment>
      {!followerId && (
        <Button classes="w-full md:w-auto" onClick={handleFollow}>
          Follow
        </Button>
      )}
      {followerId && (
        <Button classes="w-full md:w-auto" onClick={handleUnfollow}>
          Unfollow
        </Button>
      )}
    </React.Fragment>
  );
}

FollowButton.propTypes = {
  account_id: PropTypes.string,
  subscription_id: PropTypes.string
};
