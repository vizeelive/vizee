import React from 'react';
import Theme from '../src/Theme';

export const decorators = [
  (Story) => (
    <Theme>
      <Story />
    </Theme>
  )
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
};
