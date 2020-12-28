import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAffiliate from 'hooks/useAffiliate';
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';
import useAuth from 'hooks/useAuth';

import EventView from './view';
import Mapper from 'services/mapper';

const GET_EVENT_UNAUTH = gql`
  query AnonEventsReport($id: uuid!) {
    getEventUrl(id: $id) {
      url
    }
    events_report(where: { id: { _eq: $id } }) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      favorites
      description
      views
      location
      mux_livestream
      mux_id
      status
      account_only
      account {
        id
        name
        username
        photo
        stripe_data
        umami_website
        products(where: { account_access: { _eq: true } }) {
          id
          name
          price
          account_access
          flexible_price
          description
        }
      }
      products {
        id
        product {
          id
          name
          price
          account_access
          flexible_price
          description
        }
      }
    }
  }
`;

const GET_EVENT_AUTH = gql`
  query UserEventsReport($id: uuid!, $user_id: uuid!, $username: String!) {
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
    accounts(where: { username: { _eq: $username } }) {
      id
      followers {
        id
      }
    }
    users_by_pk(id: $user_id) {
      id
      affiliate_user_id
      affiliate_account_id
    }
    getEventUrl(id: $id) {
      url
    }
    events_report(where: { id: { _eq: $id } }) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      description
      transactions
      favorites
      views
      location
      account_only
      mux_livestream
      status
      account {
        id
        name
        username
        photo
        stripe_data
        umami_website
        access {
          id
        }
        users {
          user {
            id
          }
        }
        products(where: { account_access: { _eq: true } }) {
          id
          name
          price
          recurring
          access_length
          flexible_price
        }
      }
      products {
        id
        product {
          id
          name
          price
          flexible_price
          description
        }
      }
      access {
        id
      }
    }
  }
`;

const WATCH_MUX = gql`
  subscription WatchEventLiveStatus($id: uuid!) {
    events_by_pk(id: $id) {
      mux_livestream
      mux_id
      status
    }
  }
`;

const TRACK_VIEW = gql`
  mutation TrackView($object: views_insert_input!) {
    insert_views_one(object: $object) {
      id
    }
  }
`;

export default function EventPage() {
  const { id, username, status } = useParams();
  const { user } = useAuth();
  const { setAffiliateLoginUser, setAffiliateAccountId } = useAffiliate();
  const [trackView] = useMutation(TRACK_VIEW);

  const variables = user ? { id, user_id: user?.id, username } : { id };

  const { loading, error, data, refetch } = useQuery(
    user ? GET_EVENT_AUTH : GET_EVENT_UNAUTH,
    {
      variables
    }
  );

  const { data: liveData } = useSubscription(WATCH_MUX, {
    variables: { id }
  });

  const account = Mapper(data?.accounts?.[0]);
  const event = Mapper({ ...data?.events_report?.[0] });
  event.video = data?.getEventUrl?.url;
  const userId = user?.id || null;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) => acc.account.username === event.account.username
  ).length;

  const account_id = event?.account?.id;

  useEffect(() => {
    if (liveData) {
      refetch();
    }
  }, [liveData]);

  useEffect(() => {
    if (user?.id && data) {
      setAffiliateLoginUser(data.users_by_pk);
    }
    if (event?.account?.id) {
      setAffiliateAccountId(event.account.id);
    }
  }, [user, event, data, setAffiliateAccountId, setAffiliateLoginUser]);

  useEffect(() => {
    if (data?.accounts?.[0]?.id) {
      window.umami.trackView(
        `/${username}/${event.id}`,
        null,
        event.account.umami_website
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (event?.id && !isMyAccount) {
      trackView({
        variables: {
          object: {
            created_by: userId,
            account_id: account_id,
            event_id: event.id,
            city: user?.geo?.city,
            country: user?.geo?.country,
            ip: user?.geo?.ip,
            loc: user?.geo?.loc,
            postal: user?.geo?.postal,
            region: user?.geo?.region,
            timezone: user?.geo?.timezone
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  let videoJsOptions = {
    autoplay: true,
    controls: true,
    aspectRatio: '16:9',
    sources: []
  };

  let playerKey = Math.random();

  switch (event?.status) {
    // TODO remove this temporary hack
    case 'livestream':
      videoJsOptions.sources.push({
        src:
          event?.mux_livestream?.url ||
          liveData?.events_by_pk?.mux_livestream?.url,
        type: 'application/x-mpegurl'
      });
      break;
    case 'live':
    case 'completed':
      videoJsOptions.sources.push({
        src: event.video,
        type: 'application/x-mpegurl'
      });
      break;
    default:
      if (!loading) {
        if (event.belongsTo?.(user)) {
          videoJsOptions.muted = true;
          videoJsOptions.sources.push({
            src: 'https://vizee-media.s3.amazonaws.com/ready.mp4'
          });
        } else {
          videoJsOptions.muted = true;
          videoJsOptions.sources.push({
            src: 'https://vizee-media.s3.amazonaws.com/begin.mp4'
          });
        }
      }
  }

  return (
    <EventView
      loading={loading}
      error={error}
      account={account}
      event={event}
      isMyAccount={isMyAccount}
      user={user}
      playerKey={playerKey}
      videoJsOptions={videoJsOptions}
      liveData={liveData}
      status={status}
    />
  );
}
