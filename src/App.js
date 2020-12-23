import './App.less';

import { ApolloProvider } from '@apollo/client';
import LogRocket from 'logrocket';
import * as Sentry from '@sentry/react';
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from 'components/PrivateRoute';
import useAuth from 'hooks/useAuth';
import Admin from 'pages/Admin/Index';
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
  const { isLoading, user, setGeo, client, error } = useAuth();

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

  if (isLoading) {
    return (
      <Theme>
        <Centered height="full">
          <Spinner />
        </Centered>
      </Theme>
    );
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (process.env.NODE_ENV !== 'development' && user) {
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
      <ApolloProvider client={client}>
        {user && user.id && <FinishSignup />}
        <Router>
          <Switch>
            <Route path="/gif/:username/:id" component={EventGif} />
            <PrivateRoute path="/admin" user={user} component={Admin} />
            <Route path="/" component={User} />
          </Switch>
        </Router>
      </ApolloProvider>
    </Theme>
  );
}

export default App;
