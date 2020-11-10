import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FollowButton from './FollowButton.jsx';
import { useMutation } from '@apollo/client';

jest.mock('@apollo/client');

describe('FollowButton', () => {
  it('should render unfollow', () => {
    useMutation.mockReturnValue([]);
    render(<FollowButton account_id="a1b2c3" follower_id="a1b2c3" />);
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
  });
  it('should render follow', () => {
    useMutation.mockReturnValue([]);
    render(<FollowButton account_id="a1b2c3" follower_id={null} />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
  it('should follow when clicked', async () => {
    let mutation = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ data: { insert_followers_one: { id: 4 } } })
      );
    useMutation.mockReturnValue([mutation]);
    render(<FollowButton account_id="a1b2c3" follower_id={null} />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
    waitForElementToBeRemoved(() => screen.getByText('Follow'));
    await userEvent.click(screen.getByText('Follow'));
    expect(mutation.mock.calls.length).toBe(1);
    expect(mutation.mock.calls[0][0]).toEqual({
      variables: { account_id: 'a1b2c3' }
    });
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
  });
  it('should unfollow when clicked', async () => {
    let mutation = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ data: { insert_subscriptions_one: { id: 4 } } })
      );
    useMutation.mockReturnValue([mutation]);
    render(<FollowButton account_id="a1b2c3" follower_id="a1b2c3" />);
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
    waitForElementToBeRemoved(() => screen.getByText('Unfollow'));
    await userEvent.click(screen.getByText('Unfollow'));
    expect(mutation.mock.calls.length).toBe(1);
    expect(mutation.mock.calls[0][0]).toEqual({
      variables: { follower_id: 'a1b2c3' }
    });
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
});
