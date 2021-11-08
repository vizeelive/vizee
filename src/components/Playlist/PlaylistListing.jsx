import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import { Card, Space, Dropdown } from 'antd';

import EditPlaylist from 'components/Playlist/EditPlaylist';

const { Meta } = Card;

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
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-auto">
        {lists.map((playlist) => (
          <div className="hover:border-gray-900 border-2 border-transparent rounded-lg md:m-2 p-2">
            <a
              href={`/${playlist.account.username}/${playlist.events[0].event.id}?playlist=${playlist.id}`}
            >
              <img
                src={
                  playlist.events.find((e) => e.event.photo)?.event?.photo ||
                  `https://dummyimage.com/500x300/000/fff.png&text=${playlist.name}`
                }
              />
              <div
                className="whitespace-nowrap overflow-ellipsis overflow-hidden"
                style={{ height: 25, width: 200 }}
              >
                {playlist.name}
              </div>
            </a>
            {account.belongsTo(user) && (
              <a
                href="#"
                className="float-right text-gray-800"
                onClick={() => setEditing(playlist)}
              >
                Edit
              </a>
            )}
            <div className="text-gray-700">{playlist.events.length} media</div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

PlaylistListing.propTypes = {
  refetch: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  playlists: PropTypes.array.isRequired
};

export default PlaylistListing;
