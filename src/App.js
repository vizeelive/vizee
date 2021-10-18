import './App.less';

import config from 'config';
import { ApolloProvider } from '@apollo/client';
import Tracker from '@asayerio/tracker';
import trackerFetch from '@asayerio/tracker-fetch';
import trackerGraphQL from '@asayerio/tracker-graphql';
import LogRocket from 'logrocket';
import * as Sentry from '@sentry/react';
import React, { useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import VersionChecker from 'components/VersionChecker';
import PrivateRoute from 'components/PrivateRoute';
import useAuth from 'hooks/useAuth';
import Admin from 'pages/Admin/Index';
import Login from 'pages/Login';
import User from 'pages/User';
import Theme from './Theme';
import EventGif from 'pages/EventGif';
import FinishSignup from 'components/FinishSignup';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

// dont initialize LogRocket for dev or robots (Linux)
process.env.NODE_ENV !== 'development' &&
  !navigator.platform.includes('Linux') &&
  LogRocket.init('vizee/vizee');

function App() {
  const { user, setGeo, client } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetch(`${config.api}/cookie`, {
        headers: {
          'X-Name': user.nickname,
          Authorization: user.token
        },
        credentials: 'include'
      });
    }
  }, [user?.token]);

  useMemo(() => {
    async function fetchData() {
      let geo = {};
      try {
        let response = await fetch('https://ipinfo.io/?token=61a3ecaa16294f');
        if (response.ok) {
          geo = await response.json();
          let [lat, lng] = geo.loc.split(',');
          geo.loc = `${lng},${lat}`;
          setGeo(geo);
        }
      } catch (e) {
        console.log('Ad Blocker is on. Cannot fetch info');
      }
    }
    fetchData();
  }, [setGeo]);

  // if (isLoading) {
  //   return (
  //     <Theme>
  //       <Centered height="full">
  //         <Spinner />
  //       </Centered>
  //     </Theme>
  //   );
  // }

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  if (process.env.NODE_ENV !== 'development' && user) {
    const tracker = new Tracker({
      projectID: 6780942061387473
    });
    tracker.start();
    tracker.use(trackerFetch());
    tracker.use(trackerGraphQL());

    window.Intercom('boot', {
      app_id: 'relku1cr',
      email: user.email,
      created_at: new Date(),
      name: user.name,
      user_id: user.id
    });
    window.Intercom('update', {
      logrocketURL: `https://app.logrocket.com/vizee/vizee/sessions?u=${user.id}`
    });
    LogRocket.identify(user.id, {
      name: user.name,
      email: user.email
    });
    LogRocket.getSessionURL((sessionURL) => {
      console.log('LogRocket Link', sessionURL);
      Sentry.configureScope((scope) => {
        scope.setExtra('sessionURL', sessionURL);
      });
    });
  }

  return (
    <Theme>
      <VersionChecker />
      <ApolloProvider client={client}>
        {user && user.id && <FinishSignup />}
        <Router>
          <QueryParamProvider ReactRouterRoute={Route}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/gif/:username/:id" component={EventGif} />
              <PrivateRoute path="/admin" user={user} component={Admin} />
              <Route path="/" component={User} />
            </Switch>
          </QueryParamProvider>
        </Router>
      </ApolloProvider>
    </Theme>
  );
}

export default App;
