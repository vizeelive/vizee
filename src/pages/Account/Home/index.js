import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from 'logger';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import useAuth from 'hooks/useAuth';
import Mapper from 'services/mapper';
import useAffiliate from 'hooks/useAffiliate';
import getOrigin from 'lib/getOrigin';

import HomeView from './view';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

export const GET_ACCOUNT_ANON = gql`
  query GetAccount(
    $username: String!
    $affiliate_code: String
    $now: date!
    $has_affiliate: Boolean!
  ) {
    affiliate: users(where: { code: { _eq: $affiliate_code } })
      @include(if: $has_affiliate) {
      id
    }
    accounts(where: { username: { _ilike: $username } }) {
      id
      name
      photo
      preview
      username
      description
      stripe_data
      store_url
      shopify_domain
      shopify_storefront_token
      facebook
      twitter
      instagram
      images {
        url
      }
      posts(
        order_by: { date: desc, created: desc }
        where: { date: { _lte: $now } }
      ) {
        id
        date
        message
        audience
        created
        attachments {
          id
          type
          mime
          url
          cover
          event {
            id
            type
            name
            start
            end
            account {
              name
              username
            }
          }
        }
      }
      tags {
        id
        name
        events_tags(where: { event: { published: { _eq: true } } }) {
          id
        }
      }
      report {
        viewcount
        followercount
        favoritecount
        eventcount
        subscriptionscount
      }
      playlists {
        id
        name
        account {
          id
          username
        }
        events(where: { event: { id: { _is_null: false } } }) {
          id
          event {
            id
            name
            photo
            thumb
            preview
            account {
              username
            }
          }
        }
      }
      followers {
        id
      }
      links {
        id
        name
        link
      }
      supporters_report(order_by: { total: desc }) {
        first_name
        last_name
        total
      }
      products(
        where: { account_access: { _eq: true } }
        order_by: { price: asc }
      ) {
        id
        name
        price
        recurring
        access_length
        account_access
        download_access
        flexible_price
        description
      }
      events {
        id
        account_only
        price
        location
        location_pos
        name
        photo
        thumb
        start
        end
        type
        published
        status
        preview
        playlist_items {
          playlist {
            id
          }
        }
        tags {
          tag {
            id
            name
          }
        }
        account {
          id
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
  query GetAccount(
    $username: String!
    $user_id: uuid!
    $affiliate_code: String
    $now: date!
    $has_affiliate: Boolean!
  ) {
    affiliate: users(where: { code: { _eq: $affiliate_code } })
      @include(if: $has_affiliate) {
      id
    }
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
      preview
      username
      description
      instagram
      facebook
      twitter
      store_url
      stripe_id
      stripe_data
      shopify_domain
      shopify_storefront_token
      report {
        viewcount
        followercount
        favoritecount
        eventcount
        subscriptionscount
      }
      users {
        user {
          id
        }
      }
      images {
        url
      }
      posts(
        order_by: { date: desc, created: desc }
        where: { date: { _lte: $now } }
      ) {
        id
        date
        message
        audience
        created
        attachments {
          id
          type
          mime
          url
          cover
          event {
            id
            type
            name
            start
            end
            thumb
            preview
            account {
              name
              username
            }
          }
        }
      }
      tags {
        id
        name
        events_tags(where: { event: { published: { _eq: true } } }) {
          id
        }
      }
      playlists {
        id
        name
        account {
          id
          username
        }
        events(where: { event: { id: { _is_null: false } } }) {
          id
          event {
            id
            name
            photo
            account {
              username
            }
          }
        }
      }
      followers {
        id
      }
      access {
        id
      }
      links {
        id
        name
        link
      }
      supporters_report(order_by: { total: desc }) {
        first_name
        last_name
        total
      }
      products(
        where: { account_access: { _eq: true } }
        order_by: { price: asc }
      ) {
        id
        name
        price
        recurring
        access_length
        account_access
        download_access
        flexible_price
        description
      }
      events {
        id
        account_only
        price
        location
        location_pos
        name
        photo
        thumb
        start
        end
        type
        published
        status
        preview
        tags {
          tag {
            id
            name
          }
        }
        playlist_items {
          playlist {
            id
          }
        }
        account {
          id
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
  const { username: usernameParam, userCode } = useParams();
  const {
    setAffiliateLoginUser,
    setAffiliateAccountId,
    setAffiliateUserId
  } = useAffiliate();
  const { user } = useAuth();

  const username = props.username || usernameParam;

  const { loading, error, data, refetch } = useQuery(
    user ? GET_ACCOUNT_USER : GET_ACCOUNT_ANON,
    {
      variables: user
        ? {
            username,
            user_id: user.id,
            affiliate_code: userCode,
            now,
            has_affiliate: !!userCode
          }
        : { username, now, has_affiliate: !!userCode }
    }
  );

  const account = Mapper(data?.accounts?.[0]);
  const hasAccess = !!account?.access?.length;
  const followers = data?.followers_aggregate?.aggregate?.count;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) => acc.account.username.toLowerCase() === username.toLowerCase()
  ).length;

  useEffect(() => {
    if (user?.id && data) {
      setAffiliateLoginUser(data.users_by_pk);
    }
    if (data?.affiliate) {
      setAffiliateUserId(data.affiliate?.[0]?.id);
    }
    if (account?.id) {
      setAffiliateAccountId(account.id);
    }
  }, [account, data, setAffiliateAccountId, setAffiliateLoginUser, user]);

  if (!loading && !account) {
    logger.info(`Account '${username}' was not found, redirecting to home`);
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

  const origin = getOrigin();
  const shareUrl = `${origin}/${username}`;

  return (
    <HomeView
      hasAccess={hasAccess}
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

Home.propTypes = {
  username: PropTypes.string
};
