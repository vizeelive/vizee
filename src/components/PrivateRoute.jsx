import React from "react";

import { Route, Redirect } from "react-router-dom";

const PrivateRoute = (props) => {
  if (props.user) {
    return <Route path={props.path} component={props.component} />;
  } else {
    return <Redirect to="/" />;
  }
};

export default PrivateRoute;
