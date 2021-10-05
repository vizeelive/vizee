import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, List, Avatar, Input, Tabs } from 'antd';
import { gql, useMutation } from '@apollo/client';

const REMOVE_EVENTS = gql`
  mutation removeEventsFromPlaylist($deleted: [uuid!]) {
    delete_events_playlists(where: { id: { _in: $deleted } }) {
      affected_rows
    }
  }
`;

const UPDATE_PLAYLIST = gql`
  mutation updatePlaylist($playlist_id: uuid!, $object: playlists_set_input) {
    update_playlists_by_pk(pk_columns: { id: $playlist_id }, _set: $object) {
      id
    }
  }
`;

function EditPlaylist({ playlist, onClose }) {
  const [form] = Form.useForm();
  const [deleted, setDeleted] = useState([]);
  const [list, setList] = useState({ ...playlist });

  const [updatePlaylist, { loading: editingPlaylist }] = useMutation(
    UPDATE_PLAYLIST
  );

  const [removeEvents] = useMutation(REMOVE_EVENTS);

  const onFinish = async (data) => {
    let input = {
      variables: {
        playlist_id: playlist.id,
        object: {
          name: data.name
        }
      }
    };
    await updatePlaylist(input);
    if (deleted.length > 0) {
      await removeEvents({ variables: { deleted } });
    }
    onClose();
  };

  const removeFromPlaylist = async (event) => {
    list.events = list.events.filter((e) => e.id !== event.id);
    deleted.push(event.id);
    setDeleted(deleted);
    setList({ ...list });
  };

  form.setFieldsValue({
    name: playlist?.name
  });

  return (
    <Modal
      title="Edit Playlist"
      visible={true}
      onCancel={onClose}
      footer={
        <Button
          form="myForm"
          key="submit"
          htmlType="submit"
          type="primary"
          size="large"
        >
          Update Playlist
        </Button>
      }
    >
      <Form
        id="myForm"
        name="basic"
        onFinish={onFinish}
        layout="vertical"
        form={form}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>
        <List>
          {list.events.map((event, index) => (
            <List.Item
              key={index}
              actions={[
                <Button size="medium" onClick={() => removeFromPlaylist(event)}>
                  Remove
                </Button>
              ]}
            >
              {index + 1}. {event.event.name}
            </List.Item>
          ))}
        </List>
      </Form>
    </Modal>
  );
}

EditPlaylist.propTypes = {
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.object.isRequired
};

export default EditPlaylist;
