import React from 'react'
import { Collapse, Card, Avatar, Space, Dropdown, Menu, Table  } from 'antd';
import { HeartOutlined, DollarOutlined, EyeOutlined, PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import '../../styles/Playlist.css';

const { Panel } = Collapse;
const { Meta } = Card;

const menu = (
  <Menu>
    <Menu.Item key="1">
      1st menu item
    </Menu.Item>
    <Menu.Item key="2">
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3">
      3rd menu item
    </Menu.Item>
  </Menu>
);


const eventTableColumns = [
  {
    title: 'Event Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: <EyeOutlined />,
    dataIndex: 'views',
    key: 'views',
    width: 10,
  },
  {
    title: <HeartOutlined />,
    dataIndex: 'favorites',
    key: 'favorites',
    width: 10,
  },
  {
    title: <DollarOutlined />,
    dataIndex: 'favorites',
    key: 'supporters',
    width: 10,
  },
  {
    title: '',
    key: 'action',
    render: (text, record) => (
      <Space>
        <Dropdown.Button overlay={menu} />
      </Space>
    ),
    width: 10,
  },
];
const getPlaylistEvents = (playlist_id) => {
  return [
    {
      key: '1',
      event_id: 12345,
      name: 'Event 1',
      views: 43,
      favorites: 23,
      supporters: 99,
    },
    {
      key: '2',
      event_id: 12345,
      name: 'Event 2',
      views: 43,
      favorites: 23,
      supporters: 99,
    }
  ]
};

const PlaylistHeader = () => {
  return <Card className="playlist-item-header">
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" shape="square" size="large"/>}
      title="Playlist title"
      description="This is the description"
    />
  </Card>;
};

const PlaylistBody = () => {
  return (
    <div className="playlist-container">
      <Table
        columns={eventTableColumns}
        pagination={false}
        dataSource={getPlaylistEvents()}
        expandable={{
        expandedRowRender: record => (
          <p style={{ margin: 0 }}>This is where the video will play</p>
        ),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <PauseCircleOutlined onClick={e => onExpand(record, e)} />
          ): (
            <PlayCircleOutlined onClick={e => onExpand(record, e)} />
          )
      }}
      />
    </div>
  )
}
function PlaylistListing() {
  return (
    <>
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        className="site-collapse-custom-collapse"
        ghost
      >
        <Panel
          header={<PlaylistHeader />}
          key="1"
          className="site-collapse-custom-panel"
          showArrow={false}
        >
          <PlaylistBody />
        </Panel>
        <Panel
          header={<PlaylistHeader />}
          key="2"
          className="site-collapse-custom-panel"
          showArrow={false}
        >
          <PlaylistBody />
        </Panel>
        <Panel
          header={<PlaylistHeader />}
          key="3"
          className="site-collapse-custom-panel"
          showArrow={false}
        >
          <PlaylistBody />
        </Panel>
      </Collapse>
    </>
  )
}

export default PlaylistListing
