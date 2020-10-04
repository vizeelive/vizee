import config from "../config";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Tag } from "antd";
import styled from "styled-components";
import moment from "moment";
import { Helmet } from "react-helmet";

import { gql, useQuery } from "@apollo/client";

import { loadStripe } from "@stripe/stripe-js";

import VideoConference from "../components/VideoConference";
import useAuth from "../hooks/useAuth";

import { StarFilled } from "@ant-design/icons";

const { Text } = Typography;

const stripePromise = loadStripe(
  "pk_test_51GxNPWFN46jAxE7Qjk2k8EvqQyVBsaq9TZ2NXcEtBfqWpKlilZWUuAoggjDXYaPjMogzejgajC7InSicHwXSRS4x006DpoBHJl"
);

const Content = styled.div`
  margin: 20px;
  height: 100vh;
  button {
    float: right;
  }
`;

const GET_EVENT_UNAUTH = gql`
  query MyQuery($id: uuid!) {
    events_by_pk(id: $id) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      video
      account {
        name
        username
        photo
      }
      favorites {
        id
      }
    }
  }
`;

const GET_EVENT_AUTH = gql`
  query MyQuery($id: uuid!) {
    events_by_pk(id: $id) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      video
      description
      account {
        name
        username
        photo
      }
      transactions {
        id
      }
      favorites {
        id
      }
    }
  }
`;

export default function Event() {
  let { id } = useParams();
  const { user, loginWithRedirect } = useAuth();
  const { loading, error, data } = useQuery(
    user ? GET_EVENT_AUTH : GET_EVENT_UNAUTH,
    {
      variables: { id },
    }
  );

  if (loading) return "Loading...";
  if (error) return "Error";

  const event = { ...data.events_by_pk };
  event.link = `https://us.meething.space/?room=${event.id}&mesh=false`;

  const handleBuy = async () => {
    let ref = btoa(
      JSON.stringify({
        user_id: user.sub,
        event_id: event.id,
      })
    );

    const stripe = await stripePromise;

    const response = await fetch(`${config.api}/session?ref=${ref}`, {
      method: "GET",
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  const handleClick = user ? handleBuy : loginWithRedirect;

  let time = moment();
  let start = moment(event.start);
  let end = moment(event.end);
  let isFree = event.price === "$0.00";
  let isLive = time.isBetween(start, end);
  let isPurchased = event?.transactions?.length;

  const cover = event.preview ? (
    <video
      src={event.preview}
      style={{ width: "100%" }}
      loop
      autoPlay
      controls
      muted
    />
  ) : (
    <img
      width="100%"
      alt={event.name || event?.account?.name}
      src={event.photo || event.account.photo}
      style={{ objectFit: "cover", height: "62vh" }}
    />
  );

  return (
    <React.Fragment>
      <Helmet>
        <meta
          property="og:image"
          content={event?.photo || event?.account?.photo}
        />
        <meta
          property="og:title"
          content={`${event.name} - ${event.account.name}`}
        />
        <meta property="og:description" content={event.description} />
      </Helmet>
      {event.type === "live" && isLive && (isFree || isPurchased) ? (
        <VideoConference
          roomName={`${event.id}-23kjh23kjh232kj3h`}
          user={user}
        />
      ) : null}
      {event.type === "video" && isLive && (isFree || isPurchased) && (
        <video src={event.video} width="100%" autoPlay muted controls />
      )}
      {(!isFree || !isPurchased) && cover}
      <Content>
        {!isFree && !isPurchased && (
          <Button type="primary" role="link" onClick={handleClick}>
            Buy Ticket
          </Button>
        )}
        {isPurchased ? <Tag color="green">Purchased</Tag> : null}
        {isLive && <Tag color="magenta">Live Now!</Tag>}
        {isFree && <Tag color="blue">Free!</Tag>}
        <h1>{event.name}</h1>
        <h2>
          <Link to={`/${event.account.username}`}>
            <Text type="secondary">{event.account.name}</Text>
          </Link>
        </h2>
        <StarFilled /> {event.favorites.length}
        {!isPurchased && <h2>{event.price}</h2>}
        <h2>{event.description}</h2>
        <div>{moment(event.start).format("MMMM Do h:mm:ss a")}</div>
        <div>{moment(event.end).format("MMMM Do h:mm:ss a")}</div>
        {user?.isAdmin && (
          <Link to={`/admin/events/edit/${event.id}`}>Edit</Link>
        )}
      </Content>
    </React.Fragment>
  );
}
