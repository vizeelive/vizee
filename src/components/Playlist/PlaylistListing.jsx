import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import { List, Space, Dropdown } from 'antd';

import EditPlaylist from 'components/Playlist/EditPlaylist';

import {
  HeartOutlined,
  DollarOutlined,
  EyeOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import 'styles/Playlist.css';

const eventTableColumns = [
  {
    title: 'Event Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>
  },
  {
    title: <EyeOutlined />,
    dataIndex: 'views',
    key: 'views',
    width: 10
  },
  {
    title: <HeartOutlined />,
    dataIndex: 'favorites',
    key: 'favorites',
    width: 10
  },
  {
    title: <DollarOutlined />,
    dataIndex: 'favorites',
    key: 'supporters',
    width: 10
  },
  {
    title: '',
    key: 'action',
    render: (text, record) => (
      <Space>
        <Dropdown.Button overlay={menu} />
      </Space>
    ),
    width: 10
  }
];

function PlaylistListing({ account, playlists, refetch }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  let lists = playlists.filter((playlist) => playlist.events.length > 0);
  return (
    <React.Fragment>
      {editing && (
        <EditPlaylist
          playlist={editing}
          onClose={() => {
            refetch();
            setEditing(false);
          }}
        />
      )}
      <List>
        {lists.map((playlist) => (
          <List.Item
            key={playlist.id}
            actions={
              account.belongsTo(user)
                ? [<a onClick={() => setEditing(playlist)}>edit</a>]
                : null
            }
          >
            <List.Item.Meta
              avatar={
                <PlayCircleOutlined
                  style={{ fontSize: '32px', color: '#08c' }}
                />
              }
              title={
                playlist.events.length ? (
                  <a
                    href={`/${playlist.account.username}/${playlist.events[0].event.id}?playlist=${playlist.id}`}
                  >
                    {playlist.name}
                  </a>
                ) : (
                  playlist.name
                )
              }
              description={`${playlist.events.length} events`}
            />
            <div></div>
          </List.Item>
        ))}
      </List>
    </React.Fragment>
  );
}

PlaylistListing.propTypes = {
  refetch: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  playlists: PropTypes.array.isRequired
};

export default PlaylistListing;
