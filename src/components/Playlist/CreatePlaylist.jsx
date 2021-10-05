import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, List, Avatar, Input, Tabs } from 'antd';
import { gql, useQuery, useMutation } from '@apollo/client';

const { TabPane } = Tabs;

const GET_PLAYLISTS = gql`
  query getPlaylists($account_id: uuid!) {
    playlists(where: { account_id: { _eq: $account_id } }) {
      id
      name
      events {
        id
      }
    }
  }
`;

const CREATE_PLAYLIST = gql`
  mutation createPlaylist($object: playlists_insert_input!) {
    insert_playlists_one(object: $object) {
      name
    }
  }
`;

const UPDATE_PLAYLIST = gql`
  mutation addEventToPlaylist($object: events_playlists_insert_input!) {
    insert_events_playlists_one(object: $object) {
      id
    }
  }
`;

function CreatePlaylist(props) {
  const [form] = Form.useForm();

  const { loading, error, data, refetch } = useQuery(GET_PLAYLISTS, {
    variables: { account_id: props.event.account.id }
  });

  const [createPlaylist, { loading: creatingPlaylist }] = useMutation(
    CREATE_PLAYLIST
  );

  const [updatePlaylist, { loading: editingPlaylist }] = useMutation(
    UPDATE_PLAYLIST
  );

  if (loading) return <p>Loading...</p>;

  const onFinish = async (data) => {
    if (props.user?.isAdmin) {
      data.created_by = props.user.id;
    }
    let input = {
      variables: {
        object: {
          name: data.name,
          account_id: props.event.account.id,
          created_by: data.created_by,
          events: {
            data: [
              {
                event_id: props.event.id,
                created_by: data.created_by
              }
            ]
          }
        }
      }
    };
    await createPlaylist(input);
    props.onClose();
  };

  const addToPlaylist = async (playlist) => {
    let data = {
      playlist_id: playlist.id
    };
    if (props.user?.isAdmin) {
      data.created_by = props.user.id;
    }
    let input = {
      variables: {
        object: {
          playlist_id: data.playlist_id,
          event_id: props.event.id,
          created_by: data.created_by
        }
      }
    };
    await updatePlaylist(input);
    props.onClose();
  };

  return (
    <Modal visible={props.visible} onCancel={props.onClose} footer={null}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Add to playlist" key="1">
          <List>
            {data.playlists.map((playlist, index) => (
              <List.Item
                key={index}
                actions={[
                  <Button size="medium" onClick={() => addToPlaylist(playlist)}>
                    Add to playlist
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={playlist.name}
                  description={`${playlist.events.length} events`}
                />
              </List.Item>
            ))}
          </List>
        </TabPane>
        <TabPane tab="Create a playlist" key="2">
          <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
            <Button key="submit" htmlType="submit" type="primary" size="large">
              Create Playlist
            </Button>
          </Form>
          <List
            className="mt-5"
            itemLayout="horizontal"
            bordered={true}
            dataSource={[
              {
                title: props.event.name,
                description: props.event.description,
                photo: props.event.photo
              }
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.photo} />}
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

CreatePlaylist.propTypes = {
  visible: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CreatePlaylist;
