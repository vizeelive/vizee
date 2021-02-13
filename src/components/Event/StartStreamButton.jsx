import config from '../../config';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert, Modal, message } from 'antd';
import logger from 'logger';

const CREATE_STREAM = gql`
  mutation createStream($event_id: uuid!) {
    createStream(event_id: $event_id) {
      stream_key
    }
  }
`;

export default function StartStreamButton(props) {
  const [streamKey, setStreamKey] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [createStream] = useMutation(CREATE_STREAM);

  const handleStartLivestream = async () => {
    try {
      let res = await createStream({ variables: { event_id: props.event_id } });
      setStreamKey(res.data.createStream.stream_key);
      setModalVisible(true);
    } catch (e) {
      logger.error(e.message);
      message.error(e.message);
    }
  };

  return (
    <React.Fragment>
      <Modal
        title="Let's start streaming!"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <p>
          In order to livestream, you'll need to{' '}
          <a href="https://obsproject.com/download" target="_blank">
            download OBS Studio
          </a>
          .
        </p>
        <Alert
          type="info"
          message={
            <React.Fragment>
              <pre style={{ margin: 0, fontSize: '14px' }}>
                Server URL: rtmp://stream.vizee.live:5222/app
              </pre>
              <pre style={{ margin: 0, fontSize: '14px' }}>
                Stream Key: {streamKey}
              </pre>
            </React.Fragment>
          }
          style={{ marginBottom: '1.5rem' }}
        />
        <iframe
          width="470"
          height="315"
          src="https://www.youtube.com/embed/DTk99mHDX_I"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </Modal>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm lg:text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
        onClick={handleStartLivestream}
      >
        {/* Heroicon name: play */}
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Start Live Stream
      </button>
    </React.Fragment>
  );
}
