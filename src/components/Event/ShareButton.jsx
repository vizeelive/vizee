import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import cn from 'classnames';
import Button from 'components/ui/Button';

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';

const CopyButton = styled.button.attrs({
  'aria-label': 'copy link'
})`
  background-color: #aaa;
  border: none;
  padding: 0px;
  font: inherit;
  color: inherit;
  cursor: pointer;
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-20px);

  svg {
    width: 24px;
    height: 24px;
  }

  path {
    fill: #fff;
  }
`;

export default function ShareButton(props) {
  const { user } = props;
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const handleCopy = () => {
    message.success('Copied link');
  };

  let url = props.url || window.location.href.replace('/manage/events', '');
  if (user?.code) {
    url += `/${user.code}`;
  }

  return (
    <React.Fragment>
      <Modal
        title="Share"
        visible={shareModalVisible}
        footer={null}
        onCancel={() => setShareModalVisible(false)}
      >
        <FacebookShareButton url={url}>
          <FacebookIcon />
        </FacebookShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon />
        </TwitterShareButton>
        <EmailShareButton url={url}>
          <EmailIcon />
        </EmailShareButton>
        <CopyToClipboard text={url} onCopy={handleCopy}>
          <CopyButton className="react-share__ShareButton">
            <svg viewBox="0 0 24 24">
              <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
            </svg>
          </CopyButton>
        </CopyToClipboard>
      </Modal>
      <Button
        classes={props?.className}
        onClick={() => {
          setShareModalVisible(true);
          window.mixpanel.track('Share');
        }}
        data-test-id="share-button"
      >
        Share
      </Button>
    </React.Fragment>
  );
}

ShareButton.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
  user: PropTypes.object
};
