import React from 'react';
import PropTypes from 'prop-types';
import { Card, List } from 'antd';
import { useHistory } from 'react-router-dom';

const Playlist = ({ username, playlist }) => {
  const history = useHistory();
  const play = (event) => {
    history.push(`/${username}/${event.id}?playlist=${playlist.id}`);
  };
  return (
    <Card title={playlist.name} style={{ width: 300 }}>
      <List>
        {playlist.events.map((event, index) => (
          <List.Item key={index}>
            {index + 1}.&nbsp;
            <a onClick={() => play(event.event)}>{event.event.name}</a>
          </List.Item>
        ))}
      </List>
    </Card>
  );
};

Playlist.propTypes = {
  playlist: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired
};

export default Playlist;
