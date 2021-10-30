import React from 'react';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import { Typography, Table } from 'antd';
import styled from 'styled-components';

import Statistic from 'components/ui/Statistic';
import Steps from './Steps';
import abbreviateNumber from 'lib/abbreviateNumber';

const { Title } = Typography;

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
    }
  }
`;

export default function DashboardView(props) {
  const {
    loading,
    error,
    stepsComplete,
    step,
    account,
    username,
    firstEventIsLive,
    firstEventLink,
    shareLink
  } = props;

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const dataSource = account.subscriptions.map((sub) => {
    return {
      key: Math.random(),
      first_name: sub.user?.first_name,
      last_name: sub.user?.last_name
    };
  });

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name'
    }
  ];

  return (
    <article className="min-h-page">
      <Header />
      <div className="mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-2xl lg:text-lg xl:text-2xl leading-6 font-medium text-gray-200">
            {account.name}
          </h2>

          {!stepsComplete && (
            <Steps
              step={step}
              username={username}
              account={account}
              shareLink={shareLink}
              firstEventIsLive={firstEventIsLive}
              firstEventLink={firstEventIsLive}
            />
          )}

          {stepsComplete && (
            <div>
              <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {/* Cards */}

                <Statistic
                  name="Monthly Recurring Revenue (MRR)"
                  value={account.mrr}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: currency-dollar */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Payouts"
                  value={account.payouts}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: currency-dollar */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Subscribers"
                  value={account.subscriptionscount}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: currency-dollar */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Views"
                  value={abbreviateNumber(account.viewcount)}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: eye */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Favorites"
                  value={account.favoritecount}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: heart */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Followers"
                  value={account.followercount}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: people */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Events"
                  value={account.eventcount}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: video-camera */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Content Minutes"
                  value={account?.costs?.total_duration_minutes || 0}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: video-camera */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />

                <Statistic
                  name="Content Storage"
                  value={`${account?.costs?.total_size_gb || 0} GB`}
                  icon={
                    <React.Fragment>
                      {/* Heroicon name: video-camera */}
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </React.Fragment>
                  }
                />
              </div>
              <div className="mt-10 text-lg">Active Subscriptions</div>
              <Table dataSource={dataSource} columns={columns} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
