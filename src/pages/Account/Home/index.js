import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import useAuth from 'hooks/useAuth';
import Mapper from 'services/mapper';
import useAffiliate from 'hooks/useAffiliate';

import HomeView from './view';

export const GET_ACCOUNT_ANON = gql`
  query GetAccount($username: String!) {
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
      events {
        id
        location
        name
        photo
        thumb
        start
        end
        published
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
  query GetAccount($username: String!, $user_id: uuid!) {
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
      events {
        id
        location
        name
        photo
        thumb
        start
        end
        published
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

export default function Home() {
  const location = useLocation();
  const { username } = useParams();
  const { setAffiliateLoginUser, setAffiliateAccountId } = useAffiliate();
  const { user } = useAuth();

  const { loading, error, data, refetch } = useQuery(
    user ? GET_ACCOUNT_USER : GET_ACCOUNT_ANON,
    {
      variables: user ? { username, user_id: user.id } : { username }
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
  }, [account, data, setAffiliateAccountId, setAffiliateLoginUser, user.id]);

  const shareUrl = `https://viz.ee/${username}`;

  // const accountPhoto = account.photo.replace(
  //   'https://vizee-media.s3.amazonaws.com/',
  //   ''
  // );

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
