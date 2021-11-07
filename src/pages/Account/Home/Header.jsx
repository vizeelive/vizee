import React from 'react';
import styled from 'styled-components';
// import { Button } from 'antd';
import Button from 'components/ui/Button';
import { Link } from 'react-router-dom';
import ShareButton from 'components/Event/ShareButton';
import BuyButton from 'components/Event/BuyButton';
import FollowButton from 'components/Event/FollowButton';
import VideoPlayer from 'components/VideoPlayer';
import Linkify from 'react-linkify';

import abbreviateNumber from 'lib/abbreviateNumber';
import cdnImage from 'lib/cdn-image';
import useWindowSize from 'hooks/useWindowSize';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined
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
  const size = useWindowSize();
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

  let videoJsOptions = {
    autoplay: true,
    loop: true,
    controls: true,
    aspectRatio: '16:9',
    sources: [
      {
        src: account.preview,
        type: 'video/mp4'
      }
    ]
  };

  let coverUrl = account.cover().includes('ogi')
    ? account.cover()
    : cdnImage(account.cover());

  return (
    <div className="relative bg-black">
      <div className="lg:left-0 lg:h-full">
        <img className="w-full h-full" src={coverUrl} />
      </div>
      <div className="flex flex-wrap xs:px-5 md:space-x-5 py-2">
        {account.preview && (
          <div className="xs:w-screen xs:mb-5 md:flex-1">
            <span className="absolute z-50 ml-2 mt-2 items-center px-2 py-0.5 rounded-sm text-sm font-semibold bg-gray-750 text-white uppercase">
              Preview
            </span>
            <VideoPlayer
              key={`preview`}
              {...videoJsOptions}
              onEnded={() => {}}
            />
          </div>
        )}
        <div className="flex-1">
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
            <Linkify>
              {account?.description?.split('\n').map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
            </Linkify>
          </p>
          <div className="mt-8 overflow-hidden">
            {/* <dl className="-mx-8 -mt-8 flex flex-wrap">
              <div className="flex flex-col flex-grow px-8 pt-8">
                <dt className="text-center order-2 text-base font-medium text-gray-500">
                  Media
                </dt>
                <dd
                  data-test-id="account-eventcount"
                  className="text-center order-1 text-2xl font-extrabold text-pink-600 sm:text-3xl"
                >
                  {abbreviateNumber(account.report.eventcount)}
                </dd>
              </div>
              <div className="flex flex-col flex-grow px-8 pt-8">
                <dt className="text-center order-2 text-base font-medium text-gray-500">
                  Supporters
                </dt>
                <dd
                  data-test-id="account-supporterscount"
                  className="text-center order-1 text-2xl font-extrabold text-pink-600 sm:text-3xl"
                >
                  {abbreviateNumber(supportersCount)}
                </dd>
              </div>
              <div className="flex flex-col flex-grow px-8 pt-8">
                <dt className="text-center order-2 text-base font-medium text-gray-500">
                  Views
                </dt>
                <dd
                  data-test-id="account-viewcount"
                  className="text-center order-1 text-2xl font-extrabold text-pink-600 sm:text-3xl"
                >
                  {abbreviateNumber(account.report.viewcount)}
                </dd>
              </div> */}

            {/* {supportersCount ? (
                <div className="pt-5 px-8 text-gray-500">
                  Supported by {supportersCount} wonderful{' '}
                  {supportersCount == 1 ? 'person, ' : 'people including'}{' '}
                  {supportersText}.
                </div>
              ) : null} */}
            {/* </dl> */}
          </div>
        </div>
      </div>
      <div className="ml-5 md:space-x-3 space-y-3 mr-5">
        {account.stripe_data && (
          <BuyButton
            classes="w-full md:w-auto"
            isTip={true}
            user={user}
            account={account}
          />
        )}

        <ShareButton
          className="xs:w-full md:w-auto"
          url={shareUrl}
          user={user}
        />

        {account.store_url && (
          <Button onClick={() => window.open(account.store_url)}>Store</Button>
        )}

        {user && (
          <Button classes="w-full md:w-auto" onClick={openChat}>
            Chat
          </Button>
        )}

        {user && (
          <FollowButton
            account_id={account.id}
            follower_id={account?.followers?.[0]?.id}
          />
        )}

        {(user?.isAdmin || isMyAccount) &&
          !location.pathname.includes('manage') && (
            <div className="md:inline">
              <Link to={`/${account.username}/manage`}>
                <Button classes="w-full md:w-auto">Manage</Button>
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}

export default Header;
