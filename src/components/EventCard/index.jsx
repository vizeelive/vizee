import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';

import { Card } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';

import {
  Container,
  EventName,
  AccountName,
  DateText,
  TagsContainer,
  Favorite,
  CardMenu,
  ManageLink,
  EditLink,
  LiveTag
} from './EventCard.css';

function EventCard(props) {
  const { event, user, onFavoriteClick } = props;

  const history = useHistory();

  const manageRef = useRef(null);
  const editRef = useRef(null);
  const favRef = useRef(null);

  const handleCardClick = (e) => {
    if (
      !editRef.current?.contains(e.target) &&
      !favRef.current?.contains(e.target)
    ) {
      history.push(`/${event.account.username}/${event.id}`);
    }
  };

  const handleEditClick = () => {
    history.push(`/${event.account.username}/manage/events/edit/${event.id}`);
  };

  const handleManageClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    history.push(`/${event.account.username}/manage/events/${event.id}`);
  };

  const renderCover = () => {
    return (
      <img
        alt={event?.thumb || event?.account?.name || event?.name}
        src={event?.thumb || event.photo || event.account.photo}
      />
    );
  };

  const renderDates = () => {
    const startDate = moment(event.start).format('MMMM Do h:mm a');

    return (
      <React.Fragment>
        <DateText>{startDate}</DateText>
      </React.Fragment>
    );
  };

  const renderTags = () => {
    const start = moment(event.start);
    const end = moment(event.end);
    const isLive = moment().isBetween(start, end);
    // const isPurchased = event?.transactions?.length;
    // const isFree = event.price === '$0.00';
    // const isBroadcast = event.type === 'live';
    // const isVideo = event.type === 'video';

    return (
      <TagsContainer>
        {/* {isPurchased ? <Tag color="green">Purchased</Tag> : null} */}
        {isLive && <LiveTag color="#ee326e">LIVE NOW</LiveTag>}
        {/* {isFree && <Tag color="blue">Free!</Tag>} */}
        {/* {isBroadcast && <Tag color="cyan">Broadcast</Tag>} */}
        {/* {isVideo && <Tag color="gold">Video</Tag>} */}
      </TagsContainer>
    );
  };

  const renderFavorite = () => {
    if (!user) {
      return null;
    }
    const isFavorite = event?.favorites?.length;
    const Icon = isFavorite ? StarFilled : StarOutlined;

    return (
      <Favorite ref={favRef} isActive={isFavorite}>
        <Icon data-testid="favorite" onClick={onFavoriteClick} />
      </Favorite>
    );
  };

  return (
    <Container loggedIn={!!user}>
      <Card
        data-test-id="event-card"
        onClick={handleCardClick}
        hoverable
        cover={renderCover()}
      >
        <EventName level={3}>{event.name}</EventName>
        <AccountName level={4}>
          <Link to={`/${event.account.username}`}>{event?.account?.name}</Link>
        </AccountName>
        {renderDates()}
        <div>
          <small>{event.location}</small>
        </div>
        {renderTags()}
        {event.belongsTo(user) && !event?.published ? 'Unpublished' : null}
        <CardMenu>
          {event.belongsTo(user) && (
            <EditLink
              type="primary"
              ghost
              ref={editRef}
              onClick={handleEditClick}
            >
              Edit
            </EditLink>
          )}
          {event.belongsTo(user) && (
            <ManageLink
              type="primary"
              ghost
              ref={manageRef}
              onClick={(e) => handleManageClick(e)}
            >
              Manage
            </ManageLink>
          )}
        </CardMenu>
        {renderFavorite()}
      </Card>
    </Container>
  );
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  user: PropTypes.object,
  onFavoriteClick: PropTypes.func
};

export default EventCard;
