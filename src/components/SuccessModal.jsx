import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { Button, Modal, Result } from 'antd';

export default function SuccessModal(props) {
  const history = useHistory();
  const { loginWithRedirect } = useAuth();

  const onCancel = props.onCancel || window.location.pathname;

  return (
    <Modal
      title={props.title}
      visible={props.isVisible}
      footer={null}
      onCancel={() => history.push(onCancel)}
    >
      <Result
        status={props.status}
        title={props.description}
        extra={
          !props.user
            ? [
                <Button
                  type="primary"
                  key="signIn"
                  onClick={() =>
                    loginWithRedirect({
                      returnTo: onCancel
                    })
                  }
                >
                  Sign In
                </Button>
              ]
            : null
        }
      />
    </Modal>
  );
}

SuccessModal.propTypes = {
  user: PropTypes.object,
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  onCancel: PropTypes.string
};
