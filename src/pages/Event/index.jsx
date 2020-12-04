import config from 'config';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { stringify } from 'zipson';
import useAffiliate from 'hooks/useAffiliate';

import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';

import { loadStripe } from '@stripe/stripe-js';

import useAuth from 'hooks/useAuth';

import EventView from './view';
import Mapper from 'services/mapper';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const GET_EVENT_UNAUTH = gql`
  query AnonEventsReport($id: uuid!) {
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
      views
      location
      account {
        id
        name
        username
        photo
        stripe_data
        umami_website
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
      tiers {
        id
        name
        price
        description
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
      account {
        id
        name
        username
        photo
        stripe_data
        umami_website
        users {
          user {
            id
          }
        }
      }
      transaction {
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

  const { loading, error, data } = useQuery(
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

  const handleBuy = async () => {
    window.mixpanel.track('Buy Button Clicked');

    let ref = stringify({
      user_id: user?.id,
      account_id: event.account.id,
      event_id: event.id
    });

    const stripe = await stripePromise;

    const response = await fetch(`${config.api}/stripe/session?ref=${ref}`, {
      method: 'GET'
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  const liveEvent = liveData?.events_by_pk;

  let videoJsOptions = {
    autoplay: true,
    controls: true,
    aspectRatio: '16:9',
    sources: []
  };

  let playerKey = liveData?.mux_id;
  if (liveEvent?.status === 'live') {
    playerKey = Math.random();
    videoJsOptions = {
      autoplay: true,
      controls: true,
      aspectRatio: '16:9',
      sources: []
    };
    videoJsOptions.sources.push({
      src: `https://stream.mux.com/${liveEvent?.mux_livestream?.playback_ids?.[0]?.id}.m3u8`,
      type: 'application/x-mpegurl'
    });
  } else if (liveEvent?.status === 'completed') {
    playerKey = Math.random();
    videoJsOptions = {
      autoplay: true,
      controls: true,
      aspectRatio: '16:9',
      sources: []
    };
    videoJsOptions.sources.push({
      src: `https://stream.mux.com/${liveEvent?.mux_livestream?.playback_ids?.[0]?.id}.m3u8`,
      type: 'application/x-mpegurl'
    });
  } else {
    playerKey = Math.random();
    videoJsOptions = {
      autoplay: true,
      controls: true,
      aspectRatio: '16:9',
      sources: []
    };
    videoJsOptions.sources.push({
      src: event.video,
      type: 'application/x-mpegurl'
    });
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
      handleBuy={handleBuy}
      status={status}
    />
  );
}
