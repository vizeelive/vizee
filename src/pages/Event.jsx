import config from '../config';
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { stringify } from 'zipson';

import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';

import { loadStripe } from '@stripe/stripe-js';

import useAuth from '../hooks/useAuth';

import EventPage from './EventPage';
import Mapper from '../services/mapper';

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
      video
      favorites
      views
      account {
        id
        name
        username
        photo
        stripe_data
      }
    }
  }
`;

const GET_EVENT_AUTH = gql`
  query UserEventsReport($id: uuid!, $user_id: String!, $username: String!) {
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
      followers {
        id
      }
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
      video
      description
      transactions
      favorites
      views
      account {
        id
        name
        username
        photo
        stripe_data
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

export default function Event() {
  const { id, username } = useParams();

  const history = useHistory();

  const { user, loginWithRedirect } = useAuth();
  const [trackView] = useMutation(TRACK_VIEW);

  const variables = user ? { id, user_id: user?.sub, username } : { id };

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
  const userId = user?.sub || null;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) => acc.account.username === event.account.username
  ).length;

  const account_id = event?.account?.id;

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
  }, [account_id, event.id, isMyAccount, trackView, user, userId]);

  const handleBuy = async () => {
    let ref = stringify({
      user_id: user.sub,
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

  const handleClickBuy = () => {
    if (user) {
      handleBuy();
    } else {
      loginWithRedirect();
    }
  };

  const liveEvent = liveData?.events_by_pk;

  const handleEditClick = () => {
    history.push(`/${username}/manage/events/edit/${event.id}`);
  };

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
      type: 'audio/mpegURL'
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
      src: `https://stream.mux.com/${liveEvent?.mux_livestream?.playback_ids?.[0]?.id}.m3u8`
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
      type: 'video/mp4'
    });
  }

  return (
    <EventPage
      loading={loading}
      error={error}
      account={account}
      event={event}
      isMyAccount={isMyAccount}
      user={user}
      playerKey={playerKey}
      videoJsOptions={videoJsOptions}
      liveData={liveData}
      handleClickBuy={handleClickBuy}
      handleEditClick={handleEditClick}
    />
  );
}
