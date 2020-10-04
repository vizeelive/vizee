import React from 'react';

import Spinner from '../components/ui/Spinner';

export default {
  title: 'UI/Spinner',
  component: Spinner
};

const Template = (args) => <Spinner {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 3
};
