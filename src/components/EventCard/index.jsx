import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { Button, Menu, Dropdown, Tooltip, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import CreatePlaylist from 'components/Playlist/CreatePlaylist';
import { gql, useMutation } from '@apollo/client';
import cdnImage from 'lib/cdn-image';
import geopattern from 'geopattern';

import {
  AudioOutlined,
  PlaySquareOutlined,
  TeamOutlined
} from '@ant-design/icons';

const UPDATE_ACCOUNT = gql`
  mutation updateAccountPreview(
    $account_id: uuid!
    $url: String!
    $poster: String!
  ) {
    update_accounts_by_pk(
      pk_columns: { id: $account_id }
      _set: { preview: $url, preview_poster: $poster }
    ) {
      id
    }
  }
`;
function EventCard(props) {
  const { event, user, onFavoriteClick, selectCallback } = props;

  const history = useHistory();
  const [createPlaylistVisible, setCreatePlaylistVisible] = useState(false);

  const [updateAccount] = useMutation(UPDATE_ACCOUNT);

  // useEffect(() => {
  //   const card = document.getElementById(`card-${event.id}`);
  //   const eventLink = document.getElementById(`event-link-${event.id}`);

  //   const handleClick = () => {
  //     if (selectCallback) {
  //       selectCallback({ type: 'event', data: event });
  //       return;
  //     }
  //     const isTextSelected = window.getSelection().toString();
  //     if (!isTextSelected) {
  //       eventLink.click();
  //     }
  //   };

  //   card.addEventListener('click', handleClick);

  //   const clickableElements = Array.from(
  //     card.querySelectorAll('.event-clickable')
  //   );
  //   clickableElements.forEach((el) =>
  //     el.addEventListener('click', (e) => e.stopPropagation())
  //   );

  //   return () => card.removeEventListener('click', handleClick);
  // }, []);

  const setFeaturedVideo = async (event) => {
    try {
      await updateAccount({
        variables: {
          account_id: event.account.id,
          url: event.preview,
          poster: event.photo || event.thumb
        }
      });
      message.success('Set featured preview');
      props?.refetch?.();
    } catch (e) {
      message.error('Failed to set featured preview');
    }
  };

  const renderTags = () => {
    const isStreamStarting = event.isStreamStarting();
    const isAvailableNow =
      !event.isBroadcast() && event.isAvailable() && !event.isLive();
    const isLiveNow = event.isLive();

    if (!isStreamStarting && !isAvailableNow && !isLiveNow) {
      return null;
    }

    let tagText;

    if (!event.published) return null;

    if (isStreamStarting) {
      tagText = 'Stream Starting';
    }
    if (event.isFree()) {
      tagText = 'Free';
    }
    if (!isAvailableNow) {
      tagText = 'Coming ' + moment(event.start).format('MMM Do');
    }
    if (isLiveNow) {
      tagText = 'Live';
    }

    if (!tagText) return null;

    return (
      <p className="absolute top-0 left-0 px-4 py-4 transform origin-top-left xs:scale-110 sm:scale-100">
        <span className="py-1 px-3 bg-primary rounded-sm shadow text-white font-extrabold uppercase">
          {tagText}
        </span>
      </p>
    );
  };

  const renderUnPublished = () => {
    if (!event.belongsTo(user) || event.published) {
      return null;
    }
    return (
      <p className="absolute top-0 left-0 px-4 py-4 transform origin-top-left xs:scale-110 sm:scale-100">
        <span className="py-1 px-3 bg-gray-600 rounded-sm shadow text-white font-extrabold uppercase">
          Unpublished
        </span>
      </p>
    );
  };

  const renderActions = (event) => {
    return (
      <React.Fragment>
        {event.belongsTo(user) && (
          <Dropdown
            overlay={menu(event)}
            className="event-clickable float-right mr-4 mb-4"
          >
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        )}
      </React.Fragment>
    );
  };

  const menu = (event) => (
    <Menu>
      <Menu.Item key="playlist">
        <a
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            setCreatePlaylistVisible(true);
          }}
        >
          Add to playlist
        </a>
      </Menu.Item>
      <Menu.Item key="edit">
        <a
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            history.push(
              `/${event.account.username}/manage/events/edit/${event.id}`
            );
          }}
        >
          Edit
        </a>
      </Menu.Item>
      <Menu.Item key="manage">
        <a
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            history.push(
              `/${event.account.username}/manage/events/${event.id}`
            );
          }}
        >
          Show report
        </a>
      </Menu.Item>
      {event.preview && (
        <Menu.Item key="preview">
          <a
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setFeaturedVideo(event);
            }}
          >
            Set as featured preview
          </a>
        </Menu.Item>
      )}
    </Menu>
  );

  let eventLink = `/${event.account.username}/${event.id}`;
  if (event?.playlist_items?.length) {
    let playlist_id = event.playlist_items[0].playlist.id;
    eventLink = `/${event.account.username}/${event.id}?playlist=${playlist_id}`;
  }

  const handleClick = () => {
    if (selectCallback) {
      selectCallback({ type: 'event', data: event });
      return;
    }
    history.push(`/${event.account.username}/${event.id}`);
  };

  return (
    <React.Fragment>
      {createPlaylistVisible && (
        <CreatePlaylist
          user={user}
          event={event}
          visible={createPlaylistVisible}
          onClose={() => {
            props?.refetch?.();
            setCreatePlaylistVisible(false);
          }}
        />
      )}
      <article
        id={`card-${event.id}`}
        onClick={handleClick}
        className="event-card relative cursor-pointer bg-gray-950 overflow-hidden shadow rounded-3xl hover:border-red-500"
        data-test-id="event-card"
      >
        <div className="aspect-w-16 aspect-h-9">
          <img
            className="object-cover text-white"
            alt={event?.thumb || event?.account?.name || event?.name}
            src={
              event.cover()
                ? cdnImage(event.cover(), { w: 650 })
                : geopattern.generate(event.id).toDataUri()
            }
          />
        </div>
        <div className="event-card-info px-6 mt-6 md:mt-4">
          <h2 className="font-sans">
            <Link
              to={eventLink}
              className="event-name event-clickable line-clamp-2 text-gray-100 transition-colors font-bold text-xl xs:text-2xl sm:text-xl"
              id={`event-link-${event.id}`}
              title={event.name}
            >
              {event.name}
            </Link>
          </h2>
          <p className="mb-4 font-sans">
            <Link
              to={`/${event.account.username}`}
              className="event-clickable text-gray-400 hover:text-gray-300 transition-colors font-semibold text-base xs:text-lg sm:text-base"
              title={event.account?.name || ''}
            >
              {event.account?.name}
            </Link>
          </p>
        </div>
        <div className="p-5">
          <time
            className="block text-gray-500 text-base xs:text-lg sm:text-base lg:text-lg xl:text-base font-sans"
            dateTime={moment(event.start).format()}
          >
            {event.isAudio() ? (
              <React.Fragment>
                <Tooltip title="Audio">
                  <AudioOutlined style={{ verticalAlign: 'text-bottom' }} />
                </Tooltip>{' '}
                {moment(event.start).format('MMMM Do, h:mm a')}
              </React.Fragment>
            ) : null}
            {event.isVideo() || event.isBroadcast() ? (
              <React.Fragment>
                <Tooltip title="Video">
                  <PlaySquareOutlined
                    style={{ verticalAlign: 'text-bottom' }}
                  />{' '}
                </Tooltip>
                {moment(event.start).format('MMMM Do, h:mm a')}
              </React.Fragment>
            ) : null}
            {event.isConference() ? (
              <React.Fragment>
                <Tooltip title="Conference">
                  <TeamOutlined style={{ verticalAlign: 'text-bottom' }} />{' '}
                </Tooltip>
                {moment(event.start).format('MMMM Do, h:mm a')}
              </React.Fragment>
            ) : null}
          </time>
        </div>
        {renderTags()}
        {renderUnPublished()}
        {renderActions(event)}
      </article>
    </React.Fragment>
  );
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  user: PropTypes.object,
  refetch: PropTypes.func,
  onFavoriteClick: PropTypes.func
};

export default EventCard;
