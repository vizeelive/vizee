import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Button from 'components/ui/Button';
import { Card, Typography } from 'antd';
import Microlink from '@microlink/react';
import styled from 'styled-components';
import Events from 'components/Events';

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

              <ShareButton url={shareUrl} user={user} />

              {(user?.isAdmin || isMyAccount) &&
                !location.pathname.includes('manage') && (
                  <Link to={`/${account.username}/manage`}>
                    <Button>Manage</Button>
                  </Link>
                )}

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

          {account.description && (
            <AccountDescription>
              <Title data-test-id="account-bio" level={3}>
                Bio
              </Title>
              <Linkify>{account.description}</Linkify>
            </AccountDescription>
          )}

          <EventsContainer>
            <Events events={account.events} refetch={refetch} />
          </EventsContainer>
          <br />

          {account.links.length ? (
            <div data-test-id="links">
              <Title level={3}>Links</Title>
              <div class="flex flex-row space-x-4">
                {account.links.map((link) => (
                  <MicrolinkCard>
                    <Microlink url={link.link} />
                  </MicrolinkCard>
                ))}
              </div>
            </div>
          ) : null}

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
    </React.Fragment>
  );
}
