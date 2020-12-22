import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';

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
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm lg:text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
          onClick={handleFollow}
        >
          Follow
        </button>
      )}
      {followerId && (
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm lg:text-base font-medium text-gray-300 bg-black hover:bg-white-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
          onClick={handleUnfollow}
        >
          Unfollow
        </button>
      )}
    </React.Fragment>
  );
}

FollowButton.propTypes = {
  account_id: PropTypes.string,
  subscription_id: PropTypes.string
};
