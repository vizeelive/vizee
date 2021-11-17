import React, { useState } from 'react';
import config from 'config';
import {
  Button,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Menu,
  Modal,
  Radio,
  Timeline as AntTimeline,
  Input
} from 'antd';
import moment from 'moment';
import { gql, useMutation } from '@apollo/client';
import Microlink from '@microlink/react';
import Linkify from 'react-linkify';

import AvatarHandle from 'components/AvatarHandle';
import FileUpload from 'components/FileUpload';
import Events from 'components/Events';
import EventCard from 'components/EventCard';
import VideoConference from 'components/VideoConference';
import VideoPlayer from 'components/VideoPlayer';
import Images from 'pages/Account/Home/Images';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import { EllipsisOutlined, CloseOutlined } from '@ant-design/icons';

const CREATE_POST = gql`
  mutation createPost($object: posts_insert_input!) {
    insert_posts_one(object: $object) {
      id
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost($id: uuid!, $object: posts_set_input!) {
    update_posts_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
    }
  }
`;

const UPDATE_ATTACHMENTS = gql`
  mutation updateAttachments(
    $ids: [uuid!]!
    $objects: [posts_attachments_insert_input!]!
  ) {
    delete_posts_attachments(where: { id: { _in: $ids } }) {
      returning {
        id
      }
    }
    insert_posts_attachments(objects: $objects) {
      returning {
        id
      }
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
  type,
  uuid,
  format,
  user,
  account,
  posts,
  events,
  refetch
}) {
  const [form] = Form.useForm();
  const [post, setPost] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [createPost, { loading: creatingPost }] = useMutation(CREATE_POST);
  const [updatePost, { loading: updatingPost }] = useMutation(UPDATE_POST);
  const [deletePost, { loading: deletingPost }] = useMutation(DELETE_POST);
  const [updateAttachments, { loading: updatingAttachments }] = useMutation(
    UPDATE_ATTACHMENTS
  );

  const onFinish = async (values) => {
    if (values.id) {
      let input = {
        variables: {
          id: values.id,
          object: {
            ...form.getFieldsValue()
          }
        }
      };
      await updatePost(input);

      let newAttachments = attachments.filter((a) => !a?.id);
      let ids = post.attachments
        .filter((a) => !attachments.find((b) => b?.id === a?.id))
        .map((a) => a?.id);
      await updateAttachments({
        variables: {
          ids,
          objects: newAttachments.map((a) => {
            a.post_id = values.id;
            return a;
          })
        }
      });
    } else {
      let input = {
        variables: {
          object: {
            ...form.getFieldsValue(),
            ...(type === 'account' ? { account_id: uuid } : null),
            ...(type === 'event' ? { event_id: uuid } : null),
            ...(user?.isAdmin ? { created_by: user.id } : null),
            attachments: {
              data: attachments.map((a) => {
                delete a.event;
                return {
                  ...a,
                  ...(user?.isAdmin ? { created_by: user.id } : null)
                };
              })
            }
          }
        }
      };
      await createPost(input);
    }
    form.resetFields();
    setAttachments([]);
    setShowModal(false);
    refetch();
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const handleUpload = (step) => {
    let objects = step.results[':original'].map(async (file, i) => {
      let data;
      let mime = file.mime;
      let type = mime.split('/')[0];
      if (mime == 'application/pdf') {
        type = 'pdf';
      }
      if (type === 'video' || type === 'audio') {
        let audience = form.getFieldValue('audience');
        // let action = audience === 'public' ? 'preview' : 'create';
        let action = 'preview';
        let res = await fetch(
          `${config.api}/mux/asset/${action}?url=${file.ssl_url}`
        );
        data = await res.json();
      }
      return {
        type,
        mime,
        url: data?.url || file.ssl_url,
        cover: step.results?.thumbed?.[i]?.ssl_url,
        width: file.meta?.width,
        height: file.meta?.height
      };
    });
    Promise.all(objects).then((results) => {
      setAttachments([...attachments, ...results]);
    });
  };

  const handleUppyError = () => {};

  const renderAttachment = (attachment, post, opts = {}) => {
    switch (attachment.type) {
      case 'image':
        if (!attachment.url) return;
        return (
          <img
            src={attachment.url}
            style={{ maxWidth: opts?.inModal ? '100%' : '614px' }}
            alt={attachment.mime}
          />
        );
      case 'audio':
        let audioJsOptions = {
          autoplay: false,
          controls: true,
          aspectRatio: '16:9',
          poster: attachment.cover,
          sources: []
        };
        audioJsOptions.sources.push({
          src: attachment.url,
          type: 'application/x-mpegurl'
        });
        return (
          <VideoPlayer
            key={Math.random()}
            cover={`https://dummyimage.com/566x318/000/fff.png&text=Audio`}
            {...audioJsOptions}
          />
        );
      case 'video':
        let videoJsOptions = {
          autoplay: false,
          controls: true,
          aspectRatio: '16:9',
          poster: attachment.cover,
          sources: []
        };
        videoJsOptions.sources.push({
          src: attachment.url,
          type: 'application/x-mpegurl'
        });
        return <VideoPlayer key={Math.random()} {...videoJsOptions} />;
      case 'event':
        return <EventCard event={attachment.event} />;
      case 'jitsi':
        return post ? (
          <VideoConference roomName={post.id} user={user} />
        ) : (
          'Conference'
        );
      case 'pdf':
        return (
          <div>
            <Document
              file={attachment.url}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <div className="text-center mt-2">
              <p>
                Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
              </p>
              <Button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
              >
                Previous
              </Button>
              <Button
                className="ml-3"
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                Next
              </Button>
            </div>
          </div>
        );
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
        setAttachments([
          ...attachments,
          {
            type: 'link',
            mime: 'text/html',
            url: match
          }
        ]);
      });
    }
    return text;
  };

  const handleSelectCallback = (obj) => {
    setAttachments([
      ...attachments,
      {
        type: obj.type,
        event: obj.data,
        event_id: obj.data.id
      }
    ]);
    setDrawerVisible(false);
  };

  const handleAddConference = () => {
    setAttachments([
      ...attachments,
      {
        type: 'jitsi'
      }
    ]);
  };

  const handleEditPost = (post) => {
    form.setFieldsValue({
      id: post.id,
      date: moment(post.date),
      audience: post.audience,
      message: post.message
    });
    setPost(post);
    setAttachments(post.attachments);
    setShowModal(true);
  };

  const uploadOptions = {
    allowedFileTypes: ['video/*', 'audio/*', 'image/*', 'application/pdf']
  };

  const dateFormat = 'YYYY/MM/DD';

  const initialValues = {
    audience: 'public',
    date: moment(new Date().toISOString().substr(0, 10))
  };

  let backgroundClass = format === 'post' ? 'bg-gray-900' : '';

  const renderItem = (post) => (
    <div
      key={post.id}
      className={`${backgroundClass} mx-1 border-solid rounded-lg mb-5 p-5`}
    >
      <Dropdown
        className="float-right"
        overlay={
          <Menu>
            <Menu.Item
              key={`edit_${post.id}`}
              onClick={() => handleEditPost(post)}
            >
              Edit post
            </Menu.Item>
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
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <EllipsisOutlined />
        </a>
      </Dropdown>
      {format === 'post' ? (
        <div>
          <AvatarHandle
            account={account}
            date={post.date}
            audience={post.audience}
          />
        </div>
      ) : (
        <div className="text-gray-600">
          {moment(post.date).format('MMMM Do, YYYY')}
        </div>
      )}
      <div>
        <Linkify>
          {post?.message?.split('\n')?.map((item, key) => {
            return (
              <span key={key}>
                {item}
                <br />
              </span>
            );
          })}
        </Linkify>
      </div>
      {post?.attachments?.map((attachment) => (
        <div key={attachment.id} className="mt-3">
          {renderAttachment(attachment, post)}
        </div>
      ))}
      {/* {post?.attachments
        ?.filter((a) => a.type !== 'image')
        .map((attachment) => (
          <div key={attachment.id} className="mt-3">
            {renderAttachment(attachment, post)}
          </div>
        ))}
      {post?.attachments?.filter((a) => a.type === 'image').length ? (
        <div>
          <Images
            images={post?.attachments?.filter((a) => a.type === 'image')}
          />
        </div>
      ) : null} */}
    </div>
  );

  return (
    <div>
      <Drawer
        title="Select from Library"
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Events events={events} selectCallback={handleSelectCallback} />
      </Drawer>
      {account.belongsTo(user) && (
        <div
          onClick={() => {
            form.resetFields();
            setShowModal(true);
          }}
          className="mb-5 p-3 mx-1 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:cursor-pointer border-solid rounded-lg ring-gray-500"
        >
          What's on your mind, {account.name}?
        </div>
      )}

      {format === 'timeline' ? (
        <AntTimeline>
          {posts.map((post) => (
            <AntTimeline.Item>{renderItem(post)}</AntTimeline.Item>
          ))}
        </AntTimeline>
      ) : (
        <div>{posts.map((post) => renderItem(post))}</div>
      )}

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
          <Form.Item name="id" hidden={true} />
          <Form.Item name="date" className="pt-5">
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item name="audience">
            <Radio.Group>
              <Radio.Button value="public">Public</Radio.Button>
              <Radio.Button value="private">Private</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="message">
            <Input.TextArea
              autoSize={{ minRows: 4 }}
              autoFocus={true}
              onChange={(e) => checkForLinks(e.target.value)}
              placeholder={` What's on your mind, ${account.name}?`}
            />
          </Form.Item>
          {events.length && !attachments.length ? (
            <Button
              className="mb-5 mr-3"
              onClick={() => setDrawerVisible(true)}
            >
              Select Media from Library
            </Button>
          ) : null}
          {!attachments.length ? (
            <Button className="mb-5" onClick={handleAddConference}>
              Add Conference
            </Button>
          ) : null}
          {!attachments.length ? (
            <FileUpload
              id="video"
              success={handleUpload}
              error={handleUppyError}
              options={uploadOptions}
              maxNumberOfFiles={20}
            />
          ) : null}
          {attachments.map((attachment, key) => (
            <div key={key}>
              <div className="text-right">
                <CloseOutlined
                  onClick={() =>
                    setAttachments(attachments.filter((a) => a !== attachment))
                  }
                />
              </div>
              <div className="mt-3">
                {renderAttachment(attachment, null, { inModal: true })}
              </div>
            </div>
          ))}
          <Button
            type="primary"
            key="submit"
            loading={creatingPost}
            className="mt-5"
            htmlType="submit"
          >
            Post
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
