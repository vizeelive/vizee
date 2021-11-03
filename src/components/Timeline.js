import React, { useState } from 'react';
import { Button, Dropdown, Form, Menu, Modal, Popconfirm, Input } from 'antd';
import { gql, useQuery, useMutation } from '@apollo/client';
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
    if (step.results[':original'][0].mime.includes('image')) {
      setAttachments([...attachments, step.results[':original'][0].url]);
    }
  };

  const handleUppyError = () => {};

  let uploadVideoOptions = {
    allowedFileTypes: ['video/*', 'audio/*', 'image/*']
  };

  console.log({ account, user });

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
        <div className="bg-gray-900 mx-1 border-solid rounded-lg mb-5 p-5">
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
          <AvatarHandle account={account} date={post.created} />
          <div>{post.message}</div>
          {post?.attachments?.map((attachment) => (
            <div className="mt-5">
              <img className="max-w-full" src={attachment} alt="attachment" />
            </div>
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
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <AvatarHandle account={account} />
          <Form.Item name="message">
            <Input.TextArea
              className="p-5"
              autoSize={true}
              autoFocus={true}
              placeholder={` What's on your mind, ${account.name}?`}
            />
          </Form.Item>
          <FileUpload
            id="video"
            success={handleVideoUpload}
            error={handleUppyError}
            options={uploadVideoOptions}
          />
          {attachments.map((attachment) => (
            <div className="mt-5">
              <CloseOutlined
                className="float-right"
                onClick={() =>
                  setAttachments(attachments.filter((a) => a !== attachment))
                }
              />
              <img className="max-w-full" src={attachment} alt="attachment" />
            </div>
          ))}
          <Button
            className="mt-5"
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
