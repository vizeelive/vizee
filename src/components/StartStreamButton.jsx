import config from '../config';
import React, { useState } from 'react';
import { Button, Alert, Modal } from 'antd';

import { PlayCircleOutlined } from '@ant-design/icons';

export default function StartStreamButton(props) {
  const [streamKey, setStreamKey] = useState(props.streamKey);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStartLivestream = async () => {
    let res = await fetch(
      `${config.api}/mux/stream/create?id=${props.event_id}`,
      {
        method: 'GET'
      }
    );
    let data = await res.json();
    console.log(data);
    setStreamKey(data.stream_key);
    setModalVisible(true);
  };

  return (
    <React.Fragment>
      <Modal
        title="Let's start streaming!"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Alert
          type="info"
          message={
            <React.Fragment>
              <pre style={{ margin: 0, fontSize: '14px' }}>
                RTMP URL: rtmp://stream.vizee.live:5222/app
              </pre>
              <pre style={{ margin: 0, fontSize: '14px' }}>
                Stream Key: {streamKey}
              </pre>
            </React.Fragment>
          }
          style={{ marginBottom: '1.5rem' }}
        />
      </Modal>
      <Button
        type="primary"
        size="large"
        icon={<PlayCircleOutlined />}
        onClick={handleStartLivestream}
      >
        Start Live Stream
      </Button>
    </React.Fragment>
  );
}
