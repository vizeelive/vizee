import "antd/dist/antd.css";
import "antd/dist/dark-theme.js";

import { ApolloProvider } from "@apollo/client";
import { Spin } from "antd";
import LogRocket from "logrocket";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import useAuth from "./hooks/useAuth";
import Admin from "./pages/Admin";
import User from "./pages/User";
import Theme from "./Theme";

LogRocket.init("muse/muse");

function App() {
  const { isLoading, user, client, error } = useAuth();

  if (isLoading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (user) {
    LogRocket.identify(user.sub, {
      name: user.name,
      email: user.email,
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
