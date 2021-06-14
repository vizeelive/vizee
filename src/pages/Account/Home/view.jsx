import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Button from 'components/ui/Button';
import Map from 'components/Map';
import { Card, Typography, Tabs } from 'antd';
import Microlink from '@microlink/react';
import styled from 'styled-components';
import Events from 'components/Events';
import VideoConference from 'components/VideoConference';

import SuccessModal from 'components/SuccessModal';
import BuyButton from 'components/Event/BuyButton';
import ShareButton from 'components/Event/ShareButton';
import FollowButton from 'components/Event/FollowButton';
import Linkify from 'react-linkify';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

import Client from 'shopify-buy';

const { Title } = Typography;
const { Meta } = Card;
const { TabPane } = Tabs;

const MicrolinkCard = styled.div`
  max-width: 300px;

  .microlink_card {
    background-color: black;
    color: white;
    border: 01px solid #303030;
    margin-bottom: 10px;
  }
`;

const Header = styled.header`
  margin-bottom: 1rem;

  h1 {
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 992px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 1rem;
    margin-right: 0.75rem;
  }

  @media (min-width: 992px) {
    flex-direction: row-reverse;
    padding-left: 2rem;

    & > * {
      margin-right: 0;
      margin-left: 0.75rem;
    }
  }
`;

const SocialList = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0 0.75rem;
`;

const Social = styled.li`
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const EventsContainer = styled.div``;

const AccountDescription = styled.p`
  margin-bottom: 20px;
  max-width: 40rem;
`;

export default function HomeView(props) {
  const {
    hasAccess,
    account,
    user,
    isMyAccount,
    username,
    followers,
    shareUrl,
    location,
    refetch
  } = props;

  const [client, setClient] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!account.shopify_domain) return;
    const client = Client.buildClient({
      domain: account.shopify_domain,
      storefrontAccessToken: account.shopify_storefront_token
    });
    client.product.fetchAll().then((products) => {
      setClient(client);
      setProducts(products);
    });
  }, []);

  const handleBuy = (product) => {
    client.checkout.create().then((checkout) => {
      const lineItemsToAdd = [
        {
          variantId: product.variants[0].id,
          quantity: 1
        }
      ];
      client.checkout
        .addLineItems(checkout.id, lineItemsToAdd)
        .then((checkout) => {
          window.open(checkout.webUrl);
        });
    });
  };

  let supporters = account.supporters_report
    .filter((user) => user.first_name && user.last_name)
    .slice(0, 3);

  let supportersText = supporters
    .map((user) => `${user.first_name} ${user.last_name}`)
    .join(', ');

  let supportersCount = account.supporters_report.length;

  let room = account.username.toLowerCase();

  const openChat = () => {
    window.open(`https://chat.vizee.live/vizee/${account.username}`);
  };

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:image" content={account.cover()} />
        <meta property="og:title" content={`${account.name}`} />
        <meta property="og:description" content={account.description || ''} />
        <meta name="twitter:image" content={account.cover()} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${account.name}`} />
        <meta name="twitter:description" content={account.description} />
      </Helmet>
      <article className="min-h-page">
        {account.cover() && (
          <img
            // style={{
            //   objectFit: 'cover',
            //   objectPosition: 'top',
            //   maxHeight: '45vh'
            // }}
            src={account.cover()}
            // src={`https://vizee.imgix.net/${account.cover()}?fit=fill&fill=blur&w=${
            //   window.innerWidth
            // }&h=${window.innerHeight * 0.4}`}
            // alt={account.name}
            width="100%"
          />
        )}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <Header>
            <div>
              <Title data-test-id="account-name">{account.name}</Title>
              {supportersCount ? (
                <div className="text-gray-500">
                  Supported by {supportersCount} wonderful{' '}
                  {supportersCount == 1 ? 'person, ' : 'people including'}{' '}
                  {supportersText}.
                </div>
              ) : null}
              {followers.length >= 10 && (
                <p>{`${followers} follower${
                  followers.length !== 1 ? 's' : ''
                }`}</p>
              )}
            </div>
            <ActionsContainer>
              {(user?.isAdmin || isMyAccount) && (
                <Link
                  to={`/${username}/manage/events/add`}
                  data-test-id="link-create-event"
                >
                  <Button icon={<VideoCameraOutlined />} type="primary">
                    Create Event
                  </Button>
                </Link>
              )}

              {user && !user.isAdmin && (
                <FollowButton
                  account_id={account.id}
                  follower_id={account?.followers?.[0]?.id}
                />
              )}

              {!hasAccess && account.stripe_data && account.products?.length ? (
                <BuyButton user={user} account={account} />
              ) : null}

              {account.stripe_data && (
                <BuyButton isTip={true} user={user} account={account} />
              )}

              <ShareButton url={shareUrl} user={user} />

              {(user?.isAdmin || isMyAccount) &&
                !location.pathname.includes('manage') && (
                  <Link to={`/${account.username}/manage`}>
                    <Button>Manage</Button>
                  </Link>
                )}

              <Button onClick={openChat}>Chat</Button>

              <SocialList>
                {account.facebook && (
                  <Social>
                    <a
                      href={account.facebook}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FacebookOutlined /> {account.facebook.split('/').pop()}
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
                      <TwitterOutlined /> {account.twitter.split('/').pop()}
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
                      <InstagramOutlined />
                      {account.instagram.split('/').pop()}
                    </a>
                  </Social>
                )}
              </SocialList>
            </ActionsContainer>
          </Header>

          {/* <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe> */}

          {account.description && (
            <React.Fragment>
              <Title data-test-id="account-bio" level={3}>
                Bio
              </Title>
              <AccountDescription>
                <Linkify>{account.description}</Linkify>
              </AccountDescription>
            </React.Fragment>
          )}

          <div className="flex flex-col md:flex-row">
            <div className="flex-grow mb-5">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Events" key="1">
                  <EventsContainer>
                    <Events events={account.events} refetch={refetch} />
                  </EventsContainer>
                </TabPane>
                <TabPane tab="Video Chat" key="2">
                  <VideoConference
                    roomName={`${account.id}-23kjh23kjh232kj3h`}
                    user={user}
                  />
                </TabPane>
                <TabPane tab="Map" key="7">
                  <Map events={account.events} />
                </TabPane>
                {/* <TabPane tab="Street Team" key="4">
                  Street Team
                </TabPane>
                <TabPane tab="Supporters" key="5">
                  hi
                </TabPane>
                <TabPane tab="Links" key="6">
                  {account.links.length ? (
                    <div data-test-id="links">
                      <Title level={3}>Links</Title>
                      <div className="flex flex-row space-x-4">
                        {account.links.map((link) => (
                          <MicrolinkCard key={link.id}>
                            <Microlink url={link.link} />
                          </MicrolinkCard>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </TabPane> */}
              </Tabs>
            </div>
            <div className="rounded-lg md:m-10 md:w-80 bg-gray-900 p-5">
              <h1 className="text-2xl mb-10">Supporters</h1>
              {account.supporters_report.map((user, index) => (
                <Card className="mt-3" key={user.user_id}>
                  <img
                    src={
                      index <= 2
                        ? `/icons/medal-${index + 1}.png`
                        : `/icons/medal-4.png`
                    }
                    width="40"
                    className="float-left mr-2"
                  />
                  <div className="text-l">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : 'Anonymous'}{' '}
                  </div>
                </Card>
              ))}
              <div className="text-center content-center">
                <div className="mt-10 mb-5">
                  Would you like to support this channel?
                </div>
                {account.stripe_data && (
                  <BuyButton isTip={true} user={user} account={account} />
                )}
              </div>
            </div>
          </div>
          <br />

          {/* {account.links.length ? (
            <div data-test-id="links">
              <Title level={3}>Links</Title>
              <div className="flex flex-row space-x-4">
                {account.links.map((link) => (
                  <MicrolinkCard key={link.id}>
                    <Microlink url={link.link} />
                  </MicrolinkCard>
                ))}
              </div>
            </div>
          ) : null} */}

          {user?.isAdmin && account.shopify_domain && (
            <React.Fragment>
              <Title data-test-id="account-products" level={3}>
                Products
              </Title>

              {products.map((product) => {
                return (
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={product.images[0].src} />}
                  >
                    <Meta
                      title={product.title}
                      description={product.description}
                    />
                    <br />
                    <Button type="primary" onClick={() => handleBuy(product)}>
                      Buy (${product.variants[0].price})
                    </Button>
                  </Card>
                );
              })}
            </React.Fragment>
          )}
        </div>
      </article>
      <SuccessModal
        title="Congrats, you're in!"
        description="You successfully purchased a ticket to this event!"
        status="success"
        isVisible={window.location.search.includes('event.purchase')}
      />
      <SuccessModal
        title="Congrats, you're subscribed!"
        description="You successfully subscribed to this channel!"
        status="success"
        isVisible={window.location.search.includes('account.subscribe')}
      />
      <SuccessModal
        title="Thanks for the support!"
        description="Your generosity allows creators to keep doing their thing!"
        status="success"
        isVisible={window.location.search.includes('tip')}
      />
    </React.Fragment>
  );
}
