import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQueryParam, StringParam } from 'use-query-params';

import Button from 'components/ui/Button';
import Map from 'components/Map';
import { Card, Typography, Tabs, Tag } from 'antd';
import styled from 'styled-components';
import Events from 'components/Events';
import VideoConference from 'components/VideoConference';
import VideoPlayer from 'components/VideoPlayer';
import AccountHeader from './Header';
import Pricing from './Pricing';

import SuccessModal from 'components/SuccessModal';
import PlaylistListing from 'components/Playlist/PlaylistListing';
import BuyButton from 'components/Event/BuyButton';
import Confetti from 'react-confetti';
import Linkify from 'react-linkify';
import 'styles/EventView.css';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
  VideoCameraOutlined,
  TagOutlined
} from '@ant-design/icons';

import Client from 'shopify-buy';

const { Title } = Typography;
const { Meta } = Card;
const { TabPane } = Tabs;
const { CheckableTag } = Tag;

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

const EventsContainer = styled.div``;

export default function HomeView(props) {
  const {
    hasAccess,
    account,
    user,
    isMyAccount,
    followers,
    shareUrl,
    refetch
  } = props;

  const [queryTags, setQueryTags] = useQueryParam('tags', StringParam);
  let queryTagIds;
  if (queryTags) {
    queryTagIds = queryTags
      ?.split(',')
      ?.map((t) => account?.tags.find((tag) => tag.name === t)?.id);
  }

  const [client, setClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState(queryTagIds || []);

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

  const handleTagClick = (tag, checked) => {
    let queryTags;
    if (checked && !tags.includes(tag.id)) {
      queryTags = [...tags, tag.id];
    } else {
      queryTags = tags.filter((t) => t !== tag.id);
    }
    setTags(queryTags);
    setQueryTags(
      queryTags
        .map((t) => account.tags.find((tag) => tag.id === t)?.name)
        .join(',')
    );
  };

  // let videoJsOptions = {
  //   autoplay: true,
  //   controls: true,
  //   aspectRatio: '16:9',
  //   sources: [
  //     {
  //       src:
  //         'https://stream.mux.com/Az1PCBhSSYtfHUY004wpAVL2sjY8OwYw00Xg01A8nbeKXM.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MzQxMjM0MzUsImF1ZCI6InYiLCJzdWIiOiJBejFQQ0JoU1NZdGZIVVkwMDR3cEFWTDJzalk4T3dZdzAwWGcwMUE4bmJlS1hNIn0.NSWAoUVrdy0Fz4OpiRdF9J4KCHyA9iCLdglOu10QKNB8YfS1GapD01JvmlCkf4jFoigtZWZKLEPpRlxDD2LyUHSRFoJlSQvs_3amiYxjOq88Cay9dtx9MRMSwFtMtpuLO9GFxF2xnqC8uFupPK0y8jZ30QtgjKGBefJsI1RBJxif2PYPH8AXNf8BFdhyXa_F26VUGWgCKPs9YAYWYj2h_H8v3S-QqEByGRHkdyRUUaijyDdIEwaqZNRRIjf_qo_zkxuIp-sUlx9ZDEzuRVZY1Qe3ZcltX8naQSR_uTNVX_Z4YbOdlTIPnOAePdOXNcs9q195WH2MoNmeSTJsexxy0A',
  //       type: 'application/x-mpegurl'
  //     }
  //   ]
  // };

  let filteredEvents = account.events;
  if (tags.length) {
    filteredEvents = account.events.filter((event) => {
      return event.tags.some((tag) => {
        return tags.includes(tag.tag.id);
      });
    });
  }

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
        {/* {account.cover() && (
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
        )} */}

        <AccountHeader
          isMyAccount={isMyAccount}
          user={user}
          account={account}
          shareUrl={shareUrl}
        />

        {/* <div className="m-5 border-pink-600">
          <VideoPlayer key={`preview`} {...videoJsOptions} onEnded={() => {}} />
        </div> */}

        <Pricing hasAccess={hasAccess} user={user} account={account} />

        <div className="px-4 sm:px-6 lg:px-8">
          <Header>
            <div>
              {/* <Title data-test-id="account-name">{account.name}</Title> */}
              {followers.length >= 10 && (
                <p>{`${followers} follower${
                  followers.length !== 1 ? 's' : ''
                }`}</p>
              )}
            </div>
            <ActionsContainer>
              {/* {!hasAccess && account.stripe_data && account.products?.length ? (
                <BuyButton user={user} account={account} />
              ) : null} */}

              {/* {account.stripe_data && (
                <BuyButton isTip={true} user={user} account={account} />
              )}

              <ShareButton url={shareUrl} user={user} /> */}
            </ActionsContainer>
          </Header>

          {/* {account.description && (
            <React.Fragment>
              <Title data-test-id="account-bio" level={3}>
                Bio
              </Title>
              <AccountDescription>
                <Linkify>{account.description}</Linkify>
              </AccountDescription>
            </React.Fragment>
          )} */}

          <div className="flex flex-col md:flex-row">
            <div className="flex-grow mb-5 event-tabs">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Videos" key="1">
                  {account?.tags
                    ?.filter((tag) => tag.events_tags.length)
                    ?.sort(function (a, b) {
                      return a.name
                        .toLowerCase()
                        .localeCompare(b.name.toLowerCase());
                    })
                    .map((tag) => (
                      <CheckableTag
                        key={tag.id}
                        className="rounded-full border-2 border-gray-800 active:border-0 py-1 px-4 m-2"
                        checked={tags.includes(tag.id)}
                        onChange={(checked) => handleTagClick(tag, checked)}
                      >
                        {tag.name}
                      </CheckableTag>
                    ))}
                  <EventsContainer>
                    <Events events={filteredEvents} refetch={refetch} />
                  </EventsContainer>
                </TabPane>
                <TabPane tab="Playlists" key="8">
                  <PlaylistListing
                    refetch={refetch}
                    account={account}
                    playlists={account.playlists}
                  />
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
            {account.stripe_data && (
              <div className="md:mt-11 rounded-lg md:ml-5 md:w-80 bg-gray-900 p-5">
                <div className="text-center content-center">
                  <div className="mb-5">Can we please get your support? ❤️</div>
                  <BuyButton isTip={true} user={user} account={account} />
                </div>
                {account.supporters_report.map((user, index) => (
                  <Card className="mt-3" key={index}>
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
              </div>
            )}
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
                    key={product.id}
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
        user={user}
        isVisible={window.location.search.includes('event.purchase')}
      />
      <SuccessModal
        title="Congrats, you're subscribed!"
        description="You successfully subscribed to this channel!"
        status="success"
        user={user}
        isVisible={window.location.search.includes('account.subscribe')}
      />
      {window.location.search.includes('account.subscribe') && <Confetti />}
      <SuccessModal
        title="Thanks for the support!"
        description="Your generosity allows creators to keep doing their thing!"
        status="success"
        user={user}
        isVisible={window.location.search.includes('tip')}
      />
    </React.Fragment>
  );
}
