import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { CaretRightOutlined } from '@ant-design/icons';

const Playlist = ({ username, playlist, active_event_id }) => {
  const history = useHistory();
  const play = (event) => {
    history.push(`/${username}/${event.id}?playlist=${playlist.id}`);
  };

  return (
    <div className="border-2 rounded-lg border-gray-900 divide-y-2 divide-gray-900">
      <div className="bg-gray-900 p-4">{playlist.name}</div>
      {playlist.events.map((event, index) => {
        let highlighted =
          active_event_id === event.event.id ? 'bg-gray-900' : null;
        console.log({ highlighted });
        return (
          <div
            className={`flex p-2 hover:bg-gray-900 cursor-pointer ${highlighted}`}
          >
            <div className="h-full p-2 pr-5 w-1 text-gray-800">
              {highlighted ? <CaretRightOutlined /> : index + 1}
            </div>
            <div className="h-full p-2" onClick={() => play(event.event)}>
              {event.event.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Playlist.propTypes = {
  playlist: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired
};

export default Playlist;
