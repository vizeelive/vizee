import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { Button, Form, Menu, Dropdown, Tabs, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import CreatePlaylist from 'components/Playlist/CreatePlaylist';
import { gql, useQuery, useMutation } from '@apollo/client';

const UPDATE_ACCOUNT = gql`
  mutation updateAccountPreview($account_id: uuid!, $url: String!) {
    update_accounts_by_pk(
      pk_columns: { id: $account_id }
      _set: { preview: $url }
    ) {
      id
    }
  }
`;
function EventCard(props) {
  const { event, user, onFavoriteClick } = props;

  const history = useHistory();
  const [createPlaylistVisible, setCreatePlaylistVisible] = useState(false);

  const [updateAccount] = useMutation(UPDATE_ACCOUNT);

  useEffect(() => {
    const card = document.getElementById(`card-${event.id}`);
    const eventLink = document.getElementById(`event-link-${event.id}`);

    const handleClick = () => {
      const isTextSelected = window.getSelection().toString();
      if (!isTextSelected) {
        eventLink.click();
      }
    };

    card.addEventListener('click', handleClick);

    const clickableElements = Array.from(
      card.querySelectorAll('.event-clickable')
    );
    clickableElements.forEach((el) =>
      el.addEventListener('click', (e) => e.stopPropagation())
    );

    return () => card.removeEventListener('click', handleClick);
  }, []);

  const setFeaturedVideo = async (event) => {
    try {
      await updateAccount({
        variables: {
          account_id: event.account.id,
          url: event.preview
        }
      });
      message.success('Set featured preview');
      props.refetch();
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

    if (isStreamStarting) {
      tagText = 'Stream Starting';
    }
    if (isAvailableNow) {
      tagText = 'Available Now';
    }
    if (isLiveNow) {
      tagText = 'Live Now';
    }

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
      <Menu.Item key="0">
        <a
          rel="noopener noreferrer"
          onClick={() => setCreatePlaylistVisible(true)}
        >
          Add to playlist
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a
          rel="noopener noreferrer"
          onClick={() =>
            history.push(
              `/${event.account.username}/manage/events/edit/${event.id}`
            )
          }
        >
          Edit event
        </a>
      </Menu.Item>
      {event.preview && (
        <Menu.Item key="1">
          <a rel="noopener noreferrer" onClick={() => setFeaturedVideo(event)}>
            Set as featured preview
          </a>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <React.Fragment>
      {createPlaylistVisible && (
        <CreatePlaylist
          user={user}
          event={event}
          visible={createPlaylistVisible}
          onClose={() => {
            props.refetch();
            setCreatePlaylistVisible(false);
          }}
        />
      )}
      <article
        id={`card-${event.id}`}
        className="event-card relative cursor-pointer bg-gray-950 overflow-hidden shadow rounded-3xl hover:border-red-500"
        data-test-id="event-card"
      >
        <div className="aspect-w-16 aspect-h-9">
          <img
            className="object-cover text-white"
            alt={event?.thumb || event?.account?.name || event?.name}
            src={event.cover()}
          />
        </div>
        <div className="event-card-info px-6 mt-6 md:mt-4">
          <h2 className="font-sans">
            <Link
              to={`/${event.account.username}/${event.id}`}
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
            <svg
              className="inline-block align-text-top w-5 h-5 mr-2 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {moment(event.start).format('MMMM Do, h:mm a')}
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
