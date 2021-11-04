import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Menu,
  Modal,
  Popconfirm,
  Input
} from 'antd';
import moment from 'moment';
import { gql, useQuery, useMutation } from '@apollo/client';
import Microlink from '@microlink/react';

import ReactAudioPlayer from 'react-audio-player';
import AvatarHandle from 'components/AvatarHandle';
import FileUpload from 'components/FileUpload';

import { EllipsisOutlined, CloseOutlined } from '@ant-design/icons';

const CREATE_POST = gql`
  mutation createPost($object: posts_insert_input!) {
    insert_posts_one(object: $object) {
      id
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: uuid!) {
    delete_posts_by_pk(id: $id) {
      id
    }
  }
`;

export default function Timeline({
  isMyAccount,
  user,
  account,
  posts,
  refetch
}) {
  const [form] = Form.useForm();
  const [attachments, setAttachments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [createPost, { loading: creatingPost }] = useMutation(CREATE_POST);

  const [deletePost, { loading: deletingPost }] = useMutation(DELETE_POST);

  const onFinish = async () => {
    let input = {
      variables: {
        object: {
          ...form.getFieldsValue(),
          attachments,
          account_id: account.id,
          ...(user?.isAdmin ? { created_by: user.id } : null)
        }
      }
    };
    await createPost(input);
    form.resetFields();
    setAttachments([]);
    setShowModal(false);
    refetch();
  };

  const handleVideoUpload = (step) => {
    let mime = step.results[':original'][0].mime;
    let type = mime.split('/')[0];
    if (mime == 'application/pdf') {
      type = 'pdf';
    }
    setAttachments([
      ...attachments,
      { type, mime, audience: 'public', url: step.results[':original'][0].url }
    ]);
  };

  const handleUppyError = () => {};

  const uploadVideoOptions = {
    allowedFileTypes: ['video/*', 'audio/*', 'image/*', 'application/pdf']
  };

  const dateFormat = 'YYYY/MM/DD';

  const initialValues = {
    date: moment(new Date().toISOString().substr(0, 10))
  };

  const renderAttachment = (attachment) => {
    switch (attachment.type) {
      case 'image':
        return (
          <img
            src={attachment.url}
            style={{ width: '100%', height: '100%' }}
            alt={attachment.mime}
          />
        );
      case 'audio':
        return <ReactAudioPlayer src={attachment.url} controls />;
      case 'video':
        return <video src={attachment.url} controls />;
      case 'link':
        return (
          <Microlink
            style={{
              '--microlink-background-color': 'black',
              '--microlink-border-color': 'black',
              '--microlink-color': 'white',
              '--microlink-hover-background-color': 'black',
              '--microlink-hover-border-color': 'black'
            }}
            url={attachment.url}
          />
        );
    }
  };

  const checkForLinks = (text) => {
    let regex = /(https?:\/\/[^\s]+)/g;
    let matches = text.match(regex);
    if (matches) {
      matches.forEach((match) => {
        text = text.replace(match, `<Microlink url="${match}" />`);
        setAttachments([
          ...attachments,
          {
            type: 'link',
            mime: 'text/html',
            audience: 'public',
            url: match
          }
        ]);
      });
    }
    return text;
  };

  return (
    <div className="max-w-screen-sm">
      {isMyAccount && (
        <div
          onClick={() => setShowModal(true)}
          className="mb-5 p-3 mx-1 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:cursor-pointer border-solid rounded-lg ring-gray-500"
        >
          What's on your mind, {account.name}?
        </div>
      )}

      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-gray-900 mx-1 border-solid rounded-lg mb-5 p-5"
        >
          <Dropdown
            className="float-right"
            overlay={
              <Menu>
                <Menu.Item
                  key={`delete_${post.id}`}
                  onClick={() => {
                    deletePost({
                      variables: { id: post.id }
                    });
                    refetch();
                  }}
                >
                  Delete post
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <EllipsisOutlined />
            </a>
          </Dropdown>
          <AvatarHandle account={account} date={post.date} />
          <div>{post.message}</div>
          {post.attachments.map((attachment) => (
            <div className="mt-3">{renderAttachment(attachment)}</div>
          ))}
        </div>
      ))}
      <Modal
        title="Create post"
        visible={showModal}
        footer={
          false
          //   <React.Fragment>
          //     <Button onClick={() => setShowModal(false)}>Cancel</Button>
          //     <Button type="primary" key="submit" htmlType="submit">
          //       Post
          //     </Button>
          //   </React.Fragment>
        }
        onCancel={() => setShowModal(false)}
      >
        <Form
          name="basic"
          initialValues={initialValues}
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <AvatarHandle account={account} />
          <Form.Item name="date" className="pt-5">
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item name="message">
            <Input.TextArea
              autoSize={true}
              autoFocus={true}
              onChange={(e) => checkForLinks(e.target.value)}
              placeholder={` What's on your mind, ${account.name}?`}
            />
          </Form.Item>
          {!attachments.length ? (
            <FileUpload
              id="video"
              success={handleVideoUpload}
              error={handleUppyError}
              options={uploadVideoOptions}
            />
          ) : null}
          {attachments.map((attachment) => (
            <div>
              <CloseOutlined
                className="float-right"
                onClick={() =>
                  setAttachments(attachments.filter((a) => a !== attachment))
                }
              />
              <div className="mt-3">{renderAttachment(attachment)}</div>
            </div>
          ))}
          <Button
            type="primary"
            key="submit"
            loading={creatingPost}
            htmlType="submit"
          >
            Post
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
