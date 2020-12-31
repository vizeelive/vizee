import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import useAuth from 'hooks/useAuth';
import Mapper from 'services/mapper';
import useAffiliate from 'hooks/useAffiliate';

import HomeView from './view';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

export const GET_ACCOUNT_ANON = gql`
  query GetAccount($username: String!, $now: timestamptz!) {
    accounts(where: { username: { _ilike: $username } }) {
      id
      name
      photo
      username
      description
      followers {
        id
      }
      links {
        name
        link
      }
      events(where: { end: { _gte: $now } }) {
        id
        location
        name
        photo
        thumb
        start
        end
        type
        published
        status
        account {
          name
          username
          photo
        }
        favorites {
          id
        }
      }
    }
    followers_aggregate(where: { account: { username: { _eq: $username } } }) {
      aggregate {
        count
      }
    }
  }
`;

const GET_ACCOUNT_USER = gql`
  query GetAccount($username: String!, $user_id: uuid!, $now: timestamptz!) {
    myaccounts: accounts_users(
      order_by: { account: { name: asc } }
      where: { user_id: { _eq: $user_id } }
    ) {
      account {
        id
        name
        username
        followers {
          id
        }
      }
    }
    accounts(where: { username: { _ilike: $username } }) {
      id
      name
      photo
      username
      description
      instagram
      facebook
      twitter
      followers {
        id
      }
      links {
        name
        link
      }
      events(where: { end: { _gte: $now } }) {
        id
        location
        name
        photo
        thumb
        start
        end
        type
        published
        status
        account {
          name
          username
          photo
          users {
            user {
              id
            }
          }
        }
        favorites {
          id
        }
      }
    }
    followers_aggregate(where: { account: { username: { _eq: $username } } }) {
      aggregate {
        count
      }
    }
    users_by_pk(id: $user_id) {
      id
      affiliate_user_id
      affiliate_account_id
    }
  }
`;

let now = new Date();

export default function Home(props) {
  const history = useHistory();
  const location = useLocation();
  const { username: usernameParam } = useParams();
  const { setAffiliateLoginUser, setAffiliateAccountId } = useAffiliate();
  const { user } = useAuth();

  const username = props.username || usernameParam;

  const { loading, error, data, refetch } = useQuery(
    user ? GET_ACCOUNT_USER : GET_ACCOUNT_ANON,
    {
      variables: user ? { username, user_id: user.id, now } : { username, now }
    }
  );

  const account = Mapper(data?.accounts?.[0]);
  const followers = data?.followers_aggregate?.aggregate?.count;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) => acc.account.username === username
  ).length;

  useEffect(() => {
    if (user?.id && data) {
      setAffiliateLoginUser(data.users_by_pk);
    }
    if (account?.id) {
      setAffiliateAccountId(account.id);
    }
  }, [account, data, setAffiliateAccountId, setAffiliateLoginUser, user]);

  // redirects if account doesnt exist
  if (!loading && !account) {
    history.push('/');
    return null;
  }

  if (loading) {
    return (
      <Centered height="full">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const origin = process.env.REACT_APP_DOMAIN || window.location.origin;
  const shareUrl = `${origin}/${username}`;

  return (
    <HomeView
      account={account}
      user={user}
      isMyAccount={isMyAccount}
      username={username}
      error={error}
      loading={loading}
      followers={followers}
      shareUrl={shareUrl}
      location={location}
      refetch={refetch}
    />
  );
}
