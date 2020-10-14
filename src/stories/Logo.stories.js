import React from 'react';

import Logo from '../components/Logo';

export default {
  title: 'Vizee logo',
  component: Logo
};

const Template = (args) => <Logo {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 10
};
