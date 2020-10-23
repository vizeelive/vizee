import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SubscribeButton from './SubscribeButton.jsx';
import { useMutation } from '@apollo/client';

jest.mock('@apollo/client');

describe('SubscribeButton', () => {
  it('should render unsubscribe', () => {
    useMutation.mockReturnValue([]);
    render(<SubscribeButton account_id="a1b2c3" subscription_id="a1b2c3" />);
    expect(screen.getByText('Unsubscribe')).toBeInTheDocument();
  });
  it('should render subscribe', () => {
    useMutation.mockReturnValue([]);
    render(<SubscribeButton account_id="a1b2c3" subscription_id={null} />);
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });
  it('should subscribe when clicked', async () => {
    let mutation = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ data: { insert_subscriptions_one: { id: 4 } } })
      );
    useMutation.mockReturnValue([mutation]);
    render(<SubscribeButton account_id="a1b2c3" subscription_id={null} />);
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
    waitForElementToBeRemoved(() => screen.getByText('Subscribe'));
    await userEvent.click(screen.getByText('Subscribe'));
    expect(mutation.mock.calls.length).toBe(1);
    expect(mutation.mock.calls[0][0]).toEqual({
      variables: { account_id: 'a1b2c3' }
    });
    expect(screen.getByText('Unsubscribe')).toBeInTheDocument();
  });
  it('should unsubscribe when clicked', async () => {
    let mutation = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ data: { insert_subscriptions_one: { id: 4 } } })
      );
    useMutation.mockReturnValue([mutation]);
    render(<SubscribeButton account_id="a1b2c3" subscription_id="a1b2c3" />);
    expect(screen.getByText('Unsubscribe')).toBeInTheDocument();
    waitForElementToBeRemoved(() => screen.getByText('Unsubscribe'));
    await userEvent.click(screen.getByText('Unsubscribe'));
    expect(mutation.mock.calls.length).toBe(1);
    expect(mutation.mock.calls[0][0]).toEqual({
      variables: { subscription_id: 'a1b2c3' }
    });
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });
});
