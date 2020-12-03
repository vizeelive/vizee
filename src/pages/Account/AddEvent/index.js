import config from 'config';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

import { message } from 'antd';

import AddEventView from './view';

const GET_ACCOUNTS = gql`
  query GetAccounts($username: String) {
    account: accounts(where: { username: { _eq: $username } }) {
      id
      name
    }
    accounts {
      id
      name
    }
    categories {
      id
      name
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($object: events_insert_input!) {
    insert_events_one(object: $object) {
      name
      start
      end
    }
  }
`;

const GET_EVENT = gql`
  query GetEvent($id: uuid!, $username: String) {
    account: accounts(where: { username: { _eq: $username } }) {
      id
      name
    }
    events_by_pk(id: $id) {
      id
      type
      name
      start
      end
      preview
      video
      photo
      description
      price
      account_id
      category_id
      published
      location
    }
    accounts {
      name
      id
    }
    categories {
      id
      name
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $pk_columns: events_pk_columns_input!
    $_set: events_set_input!
  ) {
    update_events_by_pk(_set: $_set, pk_columns: $pk_columns) {
      id
      type
      name
      start
      video
      photo
      preview
      end
      description
      price
      account_id
    }
  }
`;

export default function AddEvent(props) {
  const params = useParams();
  const history = useHistory();

  let redirect;
  let qs = new URLSearchParams(window.location.search);
  if (qs.get('redirect') === 'dashboard') {
    redirect = `/${params.username}/manage/dashboard`;
  }
  redirect = redirect || props.redirect;

  let query;
  let options;
  let buttonLabel;

  if (params.id) {
    query = GET_EVENT;
    options = {
      variables: { id: params.id, username: params.username }
    };
    buttonLabel = 'Update Event';
  } else {
    query = GET_ACCOUNTS;
    options = { variables: { username: params.username } };
    buttonLabel = 'Save Event';
  }

  const [event, setEvent] = useState();
  const [coverType, setCoverType] = useState(null);
  const { loading, error, data } = useQuery(query, options);
  const [createEvent, { loading: isCreatingEvent }] = useMutation(CREATE_EVENT);
  const [updateEvent, { loading: isUpdatingEvent }] = useMutation(UPDATE_EVENT);

  useEffect(() => {
    setEvent(data?.events_by_pk);
  }, [data]);

  useEffect(() => {
    if (event) {
      if (event.preview) {
        setCoverType('Video');
      }
    }
  }, [event]);

  let categories, account;

  if (data) {
    categories = data.categories;
    account = data.account[0];
  }

  const onFinish = async (values) => {
    let [start, end] = values.range;

    let newEvent;

    let data = {
      name: values.name,
      type: values.type,
      price: values.price,
      description: values.description,
      category_id: values.category_id,
      account_id: values.account_id || account.id,
      video: event?.video,
      preview: event?.preview,
      photo: event?.photo,
      thumb: event?.thumb,
      start,
      end
    };

    if (values?.location?.address) {
      data.location = values.location.address;
      data.location_pos = `${values.location.pos.lng},${values.location.pos.lat}`;
    }

    if (values?.location?.pos) {
      data.location_pos = `${values.location.pos.lng},${values.location.pos.lat}`;
    }

    if (params.id) {
      newEvent = await updateEvent({
        variables: {
          pk_columns: { id: params.id },
          _set: data
        }
      });
      let url = `${window.location.origin}/${params.username}/${newEvent.data.update_events_by_pk.id}`;
      fetch(`${config.api}/prerender?url=${url}`);
      fetch(`${config.api}/mux/asset/create?url=${data.video}`);
    } else {
      newEvent = await createEvent({
        variables: {
          object: data
        }
      });
      let url = `${window.location.origin}/${params.username}/${newEvent.data.insert_events_one.id}`;
      fetch(`${config.api}/prerender?url=${url}`);
      fetch(`${config.api}/mux/asset/create?url=${data.video}`);
    }

    if (newEvent) {
      window.mixpanel.track('Event Created');
      message.success('Successfully saved event');
      history.push(redirect);
    } else {
      message.error('Failed to save event');
    }
  };

  const handlePhotoUpload = (step) => {
    setEvent({ ...event, photo: step.results[':original'][0].ssl_url });
  };

  const handlePreviewUpload = (step) => {
    setEvent({
      ...event,
      preview: step.results[':original'][0].ssl_url,
      thumb: step.results['thumbed'][0].ssl_url
    });
  };

  const handleVideoUpload = (step) => {
    setEvent({ ...event, video: step.results[':original'][0].ssl_url });
  };

  const handleUppyError = (res) => {
    message.error('An error occurred during upload.');
    throw res;
  };

  // prevents form creation because it doesn't like to re-render
  if (params.id && !event) return 'Loading...';

  // form data does not necessarily match db model. we have to reformat
  let eventData = {
    ...event,
    type: event?.type || 'live',
    preview: '',
    range: [moment(event?.start), moment(event?.end)]
  };

  let isVideoMissing = false;

  if (event?.type === 'video' && !event?.video) {
    isVideoMissing = true;
  }

  const isSubmitDisabled = isCreatingEvent || isUpdatingEvent || isVideoMissing;

  return (
    <AddEventView
      loading={loading}
      params={params}
      event={event}
      error={error}
      eventData={eventData}
      onFinish={onFinish}
      setEvent={setEvent}
      handleVideoUpload={handleVideoUpload}
      handleUppyError={handleUppyError}
      setCoverType={setCoverType}
      coverType={coverType}
      buttonLabel={buttonLabel}
      handlePhotoUpload={handlePhotoUpload}
      handlePreviewUpload={handlePreviewUpload}
      categories={categories}
      isSubmitDisabled={isSubmitDisabled}
    />
  );
}
