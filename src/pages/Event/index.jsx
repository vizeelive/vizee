import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useAffiliate from 'hooks/useAffiliate';
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';
import useAuth from 'hooks/useAuth';

import EventView from './view';
import Mapper from 'services/mapper';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

const GET_EVENT_UNAUTH = gql`
  query AnonEventsReport(
    $id: uuid!
    $affiliate_code: String
    $playlist_id: uuid
    $now: date
    $has_affiliate: Boolean!
  ) {
    affiliate: users(where: { code: { _eq: $affiliate_code } })
      @include(if: $has_affiliate) {
      id
    }
    getEventUrl(id: $id) {
      url
    }
    playlist: playlists(where: { id: { _eq: $playlist_id } }) {
      id
      name
      events(
        where: { event: { id: { _is_null: false } } }
        order_by: { created: asc }
      ) {
        event {
          id
          name
        }
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
      favorites
      transactions
      description
      views
      location
      mux_id
      stream_type
      status
      account_only
      posts(
        order_by: { date: desc, created: desc }
        where: { date: { _lte: $now } }
      ) {
        id
        date
        message
        created
        attachments {
          id
          type
          mime
          url
          preview
          cover
          event_id
        }
      }
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
          recurring
          access_length
          account_access
          download_access
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
          access_length
          account_access
          download_access
          flexible_price
          description
        }
      }
    }
  }
`;

const GET_EVENT_AUTH = gql`
  query UserEventsReport(
    $id: uuid!
    $user_id: uuid!
    $username: String!
    $affiliate_code: String
    $playlist_id: uuid
    $now: date!
    $has_affiliate: Boolean!
  ) {
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
      stripe_data
      followers {
        id
      }
    }
    users_by_pk(id: $user_id) {
      id
      affiliate_user_id
      affiliate_account_id
    }
    affiliate: users(where: { code: { _eq: $affiliate_code } })
      @include(if: $has_affiliate) {
      id
    }
    getEventUrl(id: $id) {
      url
      master
    }
    playlist: playlists(where: { id: { _eq: $playlist_id } }) {
      id
      name
      events(
        where: { event: { id: { _is_null: false } } }
        order_by: { created: asc }
      ) {
        event {
          id
          name
        }
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
      description
      transactions
      favorites
      views
      location
      account_only
      status
      stream_type
      posts(
        order_by: { date: desc, created: desc }
        where: { date: { _lte: $now } }
      ) {
        id
        date
        message
        created
        attachments {
          id
          type
          mime
          url
          preview
          cover
          event_id
        }
      }
      account {
        id
        name
        username
        photo
        stripe_data
        umami_website
        access {
          id
          product {
            download_access
          }
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
          account_access
          download_access
          description
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
          account_access
          download_access
          description
        }
      }
      access {
        id
        product {
          download_access
        }
      }
    }
  }
`;

const WATCH_MUX = gql`
  subscription WatchEventLiveStatus($id: uuid!) {
    events_by_pk(id: $id) {
      mux_id
      type
      start
      end
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

let now = new Date();

export default function EventPage({ location }) {
  const history = useHistory();
  const { id, username, status, userCode } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const { user } = useAuth();
  const {
    setAffiliateLoginUser,
    setAffiliateAccountId,
    setAffiliateUserId
  } = useAffiliate();
  const [trackView] = useMutation(TRACK_VIEW);

  const variables = user
    ? {
        id,
        user_id: user?.id,
        username,
        affiliate_code: userCode,
        playlist_id: queryParams.get('playlist'),
        now,
        has_affiliate: !!userCode
      }
    : {
        id,
        playlist_id: queryParams.get('playlist'),
        now,
        has_affiliate: !!userCode
      };

  const { loading, error, data, refetch } = useQuery(
    user ? GET_EVENT_AUTH : GET_EVENT_UNAUTH,
    {
      variables
    }
  );

  const { data: liveData } = useSubscription(WATCH_MUX, {
    variables: { id }
  });

  const playlist = queryParams.get('playlist') ? data?.playlist?.[0] : null;
  const account = Mapper(data?.events_report[0].account);
  const event = Mapper({ ...data?.events_report?.[0] });
  event.video = data?.getEventUrl?.url;
  event.master = data?.getEventUrl?.master;
  const userId = user?.id || null;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) =>
      acc.account.username.toLowerCase() ===
      event.account.username.toLowerCase()
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
    if (data?.affiliate) {
      setAffiliateUserId(data.affiliate?.[0]?.id);
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

  if (loading) {
    return (
      <Centered height="calc(100vh - 184px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  let playerKey = Math.random();

  let videoJsOptions = {
    autoplay: true,
    controls: true,
    aspectRatio: '16:9',
    sources: []
  };

  if (!event?.isBroadcast?.()) {
    videoJsOptions.sources.push({
      src: event?.video,
      type: 'application/x-mpegurl'
    });
  } else {
    switch (event?.status) {
      // TODO remove this temporary hack
      // case 'livestream':
      //   videoJsOptions.sources.push({
      //     src:
      //       event?.mux_livestream?.url ||
      //       liveData?.events_by_pk?.mux_livestream?.url,
      //     type: 'application/x-mpegurl'
      //   });
      //   break;
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
  }

  const coverPhoto = event.image()?.includes('amazonaws')
    ? event.image().replace('https://vizee-media.s3.amazonaws.com/', '')
    : event.image();

  const onEnded = () => {
    let index = playlist.events.findIndex((e) => e.event.id == event.id);
    let nextIndex = index + 1;
    if (nextIndex in playlist.events) {
      let next = playlist.events[nextIndex];
      history.push(`/${username}/${next.event.id}?playlist=${playlist.id}`);
    }
  };

  return (
    <EventView
      onEnded={onEnded}
      coverPhoto={coverPhoto}
      playlist={playlist}
      username={username}
      account={account}
      event={event}
      isMyAccount={isMyAccount}
      user={user}
      playerKey={playerKey}
      videoJsOptions={videoJsOptions}
      liveData={liveData}
      status={status}
      refetch={refetch}
    />
  );
}
