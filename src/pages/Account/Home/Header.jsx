import React from 'react';
import styled from 'styled-components';
import Button from 'components/ui/Button';
import { Link } from 'react-router-dom';
import ShareButton from 'components/Event/ShareButton';
import BuyButton from 'components/Event/BuyButton';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

const SocialList = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
`;

const Social = styled.li`
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

function Header({ shareUrl, user, account, isMyAccount }) {
  const openChat = () => {
    window.open(
      `https://chat.vizee.live/vizee/channels/${account.username.toLowerCase()}`
    );
  };

  let supportersCount = account.supporters_report.length;

  let supporters = account.supporters_report
    .filter((user) => user.first_name && user.last_name)
    .slice(0, 3);

  let supportersText = supporters
    .map((user) => `${user.first_name} ${user.last_name}`)
    .join(', ');

  return (
    <div className="relative bg-black">
      <div className="h-56 sm:h-72 lg:left-0 lg:h-full">
        <img className="w-full h-full object-cover" src={account.cover()} />
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="">
          <h2
            data-test-id="account-name"
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            {account.name}
          </h2>
          <SocialList>
            {account.facebook && (
              <Social>
                <a
                  href={account.facebook}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FacebookOutlined style={{ verticalAlign: 'text-bottom' }} />
                  &nbsp;
                  {account.facebook.split('/').pop()}
                </a>
              </Social>
            )}
            {account.twitter && (
              <Social>
                <a
                  href={account.twitter}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <TwitterOutlined style={{ verticalAlign: 'text-bottom' }} />
                  &nbsp;
                  {account.twitter.split('/').pop()}
                </a>
              </Social>
            )}
            {account.instagram && (
              <Social>
                <a
                  href={account.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <InstagramOutlined style={{ verticalAlign: 'text-bottom' }} />
                  &nbsp;
                  {account.instagram.split('/').pop()}
                </a>
              </Social>
            )}
          </SocialList>
          <p data-test-id="account-bio" className="mt-6 text-lg text-gray-500">
            {account.description}
          </p>
          <div className="mt-8 overflow-hidden">
            <dl className="-mx-8 -mt-8 flex flex-wrap">
              <div className="flex flex-col px-8 pt-8">
                <dt className="order-2 text-base font-medium text-gray-500">
                  Events
                </dt>
                <dd className="order-1 text-2xl font-extrabold text-pink-600 sm:text-3xl">
                  {account.report.eventcount}
                </dd>
              </div>
              <div className="flex flex-col px-8 pt-8">
                <dt className="order-2 text-base font-medium text-gray-500">
                  Supporters
                </dt>
                <dd className="order-1 text-2xl font-extrabold text-pink-600 sm:text-3xl">
                  {supportersCount}
                </dd>
              </div>
              <div className="flex flex-col px-8 pt-8">
                <dt className="order-2 text-base font-medium text-gray-500">
                  Views
                </dt>
                <dd className="order-1 text-2xl font-extrabold text-pink-600 sm:text-3xl">
                  {account.report.viewcount}
                </dd>
              </div>

              {/* {supportersCount ? (
                <div className="pt-5 px-8 text-gray-500">
                  Supported by {supportersCount} wonderful{' '}
                  {supportersCount == 1 ? 'person, ' : 'people including'}{' '}
                  {supportersText}.
                </div>
              ) : null} */}
            </dl>

            <div className="p-2 space-x-3">
              {(user?.isAdmin || isMyAccount) && (
                <Link
                  to={`/${account.username}/manage/events/add`}
                  data-test-id="link-create-event"
                >
                  <Button icon={<VideoCameraOutlined />} type="primary">
                    Create Event
                  </Button>
                </Link>
              )}
              {/* {account.stripe_data && (
                <BuyButton isTip={true} user={user} account={account} />
              )} */}
              <ShareButton
                className="xs:w-full md:w-auto"
                url={shareUrl}
                user={user}
              />

              {user && <Button onClick={openChat}>Chat</Button>}
              {(user?.isAdmin || isMyAccount) &&
                !location.pathname.includes('manage') && (
                  <Link to={`/${account.username}/manage`}>
                    <Button>Manage</Button>
                  </Link>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
