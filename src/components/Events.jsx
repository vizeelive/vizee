import React from "react";
import { Row, Tag, Card, Typography } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { gql, useMutation } from "@apollo/client";
import useAuth from "../hooks/useAuth";

import { StarOutlined, StarFilled } from "@ant-design/icons";

const { Text } = Typography;

const CREATE_FAVORITE = gql`
  mutation CreateFavorite($object: favorites_insert_input!) {
    insert_favorites_one(object: $object) {
      id
      event_id
    }
  }
`;

const Grid = styled.a`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

  .ant-card-bordered {
    margin: 5px;
    height: 60vh;
    overflow: hidden;
  }

  .ant-card-cover img {
    object-fit: cover;
    height: 15vw;
  }

  .ant-card-cover video {
    object-fit: cover;
    height: 15vw;
  }

  .ant-tag {
    float: right;
  }
`;

const Favorite = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

const EditLink = styled(Link)`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

export default function Events(props) {
  const { user } = useAuth();
  const [createFavorite] = useMutation(CREATE_FAVORITE);

  const handleFavorite = async (e, event) => {
    e.preventDefault();
    await createFavorite({
      variables: {
        object: {
          event_id: event.id,
        },
      },
    });
    props.refetch();
  };

  let events;
  if (props.category) {
    events = props.events.filter((event) => {
      return event.category.id === props.category;
    });
  } else {
    events = props.events;
  }

  return (
    <Grid>
      {events.map((event) => {
        let time = moment();
        let start = moment(event.start);
        let end = moment(event.end);
        let isLive = time.isBetween(start, end);
        let isPurchased = event?.transactions?.length;
        let isFavorite = event?.favorites?.length;
        let isFree = event.price === "$0.00";
        const cover =
          event.preview && isLive ? (
            <video src={event.preview} autoPlay controls loop muted />
          ) : (
            <img
              alt={event?.account?.name}
              src={event.photo || event.account.photo}
            />
          );
        return (
          <Link key={event.id} to={`/events/${event.id}`}>
            <Card hoverable cover={cover}>
              <Row>
                {isPurchased ? <Tag color="green">Purchased</Tag> : null}
                {isLive && <Tag color="magenta">Live Now!</Tag>}
                {isFree && <Tag color="blue">Free!</Tag>}
              </Row>
              <h3>{event.name}</h3>
              <h3>
                <Text type="secondary">
                  <Link to={`/${event.account.username}`}>
                    {event?.account?.name}
                  </Link>
                </Text>
              </h3>
              <div>{moment(event.start).format("MMMM Do h:mm:ss a")}</div>
              <div>{moment(event.end).format("MMMM Do h:mm:ss a")}</div>
              <div>{event.description}</div>
              {user?.isAdmin && (
                <EditLink to={`/admin/events/edit/${event.id}`}>Edit</EditLink>
              )}
              {user ? (
                <Favorite>
                  {isFavorite ? (
                    <StarFilled onClick={(e) => handleFavorite(e, event)} />
                  ) : (
                    <StarOutlined onClick={(e) => handleFavorite(e, event)} />
                  )}
                </Favorite>
              ) : null}
            </Card>
          </Link>
        );
      })}
    </Grid>
  );
}
