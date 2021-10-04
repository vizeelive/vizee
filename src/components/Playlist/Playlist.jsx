import React, { useState } from 'react';
import { Button } from 'antd';
import { OrderedListOutlined } from "@ant-design/icons";
import PlaylistListing from './PlaylistListing';
import CreatePlaylist from './CreatePlaylist';


const Playlist = ({ events }) => {
  const [isCreatePlaylistView, setCreatePlaylistView] = useState();
  let playListView;
  if (isCreatePlaylistView) {
    playListView = <CreatePlaylist events={events} />
  } else {
    playListView = <PlaylistListing  />
  }

  return (
    <>
      <Button
        icon={<OrderedListOutlined />}
        type="primary"
        onClick={() => setCreatePlaylistView(true)}
      >
        Create Playlist
      </Button>
      {playListView}
    </>
    
  )
}

export default Playlist
