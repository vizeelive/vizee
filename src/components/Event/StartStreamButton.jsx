import config from 'config';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert, Modal, Button, message, Row, Col, Card } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import logger from 'logger';

const CREATE_STREAM = gql`
  mutation createStream($type: String!, $event_id: uuid!) {
    createStream(type: $type, event_id: $event_id) {
      stream_key
    }
  }
`;

export default function StartStreamButton(props) {
  const [streamKey, setStreamKey] = useState({ url: null, key: null });
  const [modalVisible, setModalVisible] = useState(false);
  const [streamModalVisible, setStreamModalVisible] = useState(false);
  const [createStream] = useMutation(CREATE_STREAM);

  const handleStartLivestream = async (type) => {
    try {
      let res = await createStream({
        variables: { type, event_id: props.event_id }
      });
      setStreamKey(res.data.createStream.stream_key);
      setModalVisible(false);
      setStreamModalVisible(true);
    } catch (e) {
      logger.error(e.message);
      message.error(e.message);
      throw e;
    }
  };

  const handleCopy = () => {
    message.success('Copied!');
  };

  return (
    <React.Fragment>
      <Modal
        title="Let's start streaming!"
        visible={streamModalVisible}
        footer={null}
        onCancel={() => setStreamModalVisible(false)}
        width={660}
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
                Server URL:{' '}
                <CopyToClipboard text={streamKey.url} onCopy={handleCopy}>
                  <span className="p-1 hover:bg-pink-600 cursor-pointer">
                    {streamKey.url}
                  </span>
                </CopyToClipboard>
              </pre>
              <pre style={{ margin: 0, fontSize: '14px' }}>
                Stream Key:{' '}
                <CopyToClipboard text={streamKey.key} onCopy={handleCopy}>
                  <span className="p-1 hover:bg-pink-600 cursor-pointer">
                    {streamKey.key}
                  </span>
                </CopyToClipboard>
              </pre>
            </React.Fragment>
          }
          style={{ marginBottom: '1.5rem' }}
        />
        <iframe
          width="610"
          height="315"
          src="https://www.youtube.com/embed/DTk99mHDX_I"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Modal>

      <Modal
        title="Choose your stream type"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Fast" bordered={true}>
              <p>Super low latency (3s)</p>
              <p>Not recorded.</p>
              <Button
                type="primary"
                onClick={() => handleStartLivestream('ivs_fast')}
              >
                Choose
              </Button>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Normal" bordered={true}>
              <p>Normal latency (20s)</p>
              <p>Recorded.</p>
              <Button
                type="primary"
                onClick={() => handleStartLivestream('mux')}
              >
                Choose
              </Button>
            </Card>
          </Col>
        </Row>
      </Modal>

      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm lg:text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
        onClick={() => setModalVisible(true)}
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
