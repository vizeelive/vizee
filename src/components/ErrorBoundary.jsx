import React from 'react';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';

import * as Sentry from '@sentry/react';
import { ErrorBoundary } from 'react-error-boundary';

export default function ErrorBoundaryComponent(props) {
  const history = useHistory();

  function ErrorFallback({ error, resetErrorBoundary }) {
    Sentry.captureException(error);
    return (
      <Result
        status="warning"
        title="Sorry, something went wrong."
        extra={
          <Button
            type="primary"
            key="console"
            onClick={() => {
              resetErrorBoundary();
              history.push('/');
            }}
          >
            Go to Home Page
          </Button>
        }
      />
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {props.children}
    </ErrorBoundary>
  );
}
