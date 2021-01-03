import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import App from './App';
import * as serviceWorker from './serviceWorker';

// if (process.env.REACT_APP_MOCK) {
//   const { worker } = require('./mocks/browser');
//   (async function main() {
//     await worker.start();
//   })();
// }

if (window.Cypress) {
  window.mixpanel = {
    identify: () => {},
    track: () => {},
    people: {
      set: () => {}
    }
  };
}

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn:
      'https://16f3e02884104cff9010e2a196d9183e@o473703.ingest.sentry.io/5508932',
    integrations: [new Integrations.BrowserTracing()],
    // beforeSend(event, hint) {
    //   // Check if it is an exception, and if so, show the report dialog
    //   console.log({ hint });
    //   if (event.exception) {
    //     Sentry.showReportDialog({ eventId: event.event_id });
    //   }
    //   return event;
    // },

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  });
}

const onRedirectCallback = (appState) => {
  if (appState?.onboarding) {
    window.history.pushState({}, '', '/signup');
  } else if (appState?.returnTo) {
    window.history.pushState({}, '', appState.returnTo);
  }
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH_DOMAIN}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
