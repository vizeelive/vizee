import 'antd/dist/dark-theme.js';

import { ApolloProvider } from '@apollo/client';
import LogRocket from 'logrocket';
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import useAuth from './hooks/useAuth';
import Admin from './pages/Admin';
import User from './pages/User';
import Theme from './Theme';

import { Centered } from './components/styled/common';
import Spinner from './components/ui/Spinner';

import './App.less';

LogRocket.init('muse/muse');

function App() {
  const { isLoading, user, setGeo, client, error } = useAuth();

  useMemo(() => {
    async function fetchData() {
      let geo = {};
      let response = await fetch('https://ipinfo.io/?token=61a3ecaa16294f');

      if (response.ok) {
        geo = await response.json();
        setGeo(geo);
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

  if (user) {
    LogRocket.identify(user.sub, {
      name: user.name,
      email: user.email
    });
  }

  return (
    <Theme>
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <PrivateRoute path="/admin" user={user} component={Admin} />
            <Route path="/" component={User} />
          </Switch>
        </Router>
      </ApolloProvider>
    </Theme>
  );
}

export default App;
