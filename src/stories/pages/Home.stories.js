import React from 'react';
import 'antd/dist/antd.dark.css';
// import 'antd/dist/dark-theme.js';
import '../../App.less';
import { withApolloClient } from 'storybook-addon-apollo-client';
import { BrowserRouter as Router } from 'react-router-dom';

import Home from '../../pages/Home/view';
import Mapper from '../../services/mapper';

let { events, categories } = require('./data');
events = new Mapper(events);
categories = new Mapper(categories);

export const withRouter = (story) => <Router>{story()}</Router>;

export default {
  title: 'Home Page',
  component: Home,
  decorators: [withApolloClient, withRouter]
};

const Template = (args) => <Home {...args} />;

export const Default = Template.bind({});
Default.args = {
  events,
  categories,
  error: false,
  loading: false,
  search: () => {},
  isMobile: false,
  searchData: [],
  refetch: () => {},
  showModal: () => {}
};
