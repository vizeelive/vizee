import config from 'config';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

import { message, notification } from 'antd';

import AddEventView from './view';

import Spinner from 'components/ui/Spinner';
import { Centered } from 'components/styled/common';

const GET_ACCOUNTS = gql`
  query GetAccounts($username: String) {
    account: accounts(where: { username: { _ilike: $username } }) {
      id
      name
      products(where: { account_access: { _eq: false } }) {
        id
        name
        price
        flexible_price
      }
      tags {
        id
        name
      }
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
      id
      name
      start
      end
    }
  }
`;

const GET_EVENT = gql`
  query GetEvent($id: uuid!, $username: String) {
    account: accounts(where: { username: { _ilike: $username } }) {
      id
      name
      tags {
        id
        name
      }
      products(where: { account_access: { _eq: false } }) {
        id
        name
        price
        flexible_price
      }
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
      on_network
      location
      account_only
      tags {
        id
        tag {
          id
        }
      }
      products {
        id
        event_id
        product {
          name
          id
        }
      }
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

const UPDATE_EVENT_PRODUCTS = gql`
  mutation UpdateEventProducts(
    $objects: [events_products_insert_input!]!
    $delete_ids: [uuid!]!
  ) {
    delete_events_products(where: { id: { _in: $delete_ids } }) {
      affected_rows
    }
    insert_events_products(objects: $objects) {
      affected_rows
    }
  }
`;

const DELETE_EVENT_PRODUCTS = gql`
  mutation DeleteEventProducts($delete_ids: [uuid!]!) {
    delete_events_products(where: { id: { _in: $delete_ids } }) {
      affected_rows
    }
  }
`;

const UPDATE_EVENT_TAGS = gql`
  mutation UpdateEventTags(
    $objects: [events_tags_insert_input!]!
    $delete_ids: [uuid!]
  ) {
    delete_events_tags(where: { id: { _in: $delete_ids } }) {
      returning {
        id
      }
    }
    insert_events_tags(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

const DELETE_EVENT_TAGS = gql`
  mutation DeleteEventTags($delete_ids: [uuid!]!) {
    delete_events_tags(where: { id: { _in: $delete_ids } }) {
      returning {
        id
      }
    }
  }
`;

const CREATE_TAGS = gql`
  mutation CreateTags($objects: [tags_insert_input!]!) {
    insert_tags(objects: $objects) {
      returning {
        id
        name
      }
    }
  }
`;

export default function AddEvent(props) {
  const params = useParams();
  const { user } = useAuth();
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
  const [createTags, { loading: isCreatingTags }] = useMutation(CREATE_TAGS);
  const [createEvent, { loading: isCreatingEvent }] = useMutation(CREATE_EVENT);
  const [updateEvent, { loading: isUpdatingEvent }] = useMutation(UPDATE_EVENT);
  const [deleteEventProducts] = useMutation(DELETE_EVENT_PRODUCTS);
  const [updateEventProducts] = useMutation(UPDATE_EVENT_PRODUCTS);
  const [deleteEventTags] = useMutation(DELETE_EVENT_TAGS);
  const [updateEventTags] = useMutation(UPDATE_EVENT_TAGS);

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

  let categories, account, tags;

  if (data) {
    tags = data?.account?.[0]?.tags || data?.events_by_pk?.tags;
    categories = data.categories;
    account = data.account[0];
  }

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Oops!',
      description: 'Please correct the errors above highlighted in red.'
    });
  };

  const onFinishFailed = (values) => {
    openNotificationWithIcon('error');
  };

  const onFinish = async (values) => {
    let [start, end] = values.range;

    let newEvent;

    let inputData = {
      name: values.name,
      type: values.type,
      price: values.price,
      published: values.published,
      on_network: values.on_network,
      description: values.description,
      category_id: values.category_id,
      account_id: values.account_id || account.id,
      account_only: values.account_only,
      video: event?.video,
      preview: event?.preview,
      photo: event?.photo,
      thumb: event?.thumb,
      start,
      end
    };

    if (values?.location?.address) {
      inputData.location = values.location.address;
      inputData.location_pos = `${values.location.pos.lng},${values.location.pos.lat}`;
    }

    if (values?.location?.pos) {
      inputData.location_pos = `${values.location.pos.lng},${values.location.pos.lat}`;
    }

    if (params.id) {
      newEvent = await updateEvent({
        variables: {
          pk_columns: { id: params.id },
          _set: inputData
        }
      });
      let url = `${window.location.origin}/${params.username}/${newEvent.data.update_events_by_pk.id}`;
      fetch(`${config.api}/prerender?url=${url}`);
      fetch(`${config.api}/mux/asset/create?url=${inputData.video}`);
    } else {
      newEvent = await createEvent({
        variables: {
          object: inputData
        }
      });
      let url = `${window.location.origin}/${params.username}/${newEvent.data.insert_events_one.id}`;
      fetch(`${config.api}/prerender?url=${url}`);
      fetch(`${config.api}/mux/asset/create?url=${inputData.video}`);
    }

    if (newEvent) {
      let event_id =
        newEvent?.data?.insert_events_one?.id ||
        newEvent?.data?.update_events_by_pk?.id;

      if (values.event_tags.length) {
        // determine which tags need to be created and updated
        let tagsToCreate = [];
        let tagsToUpdate = [];
        values.event_tags.forEach((tag) => {
          if (account?.tags?.filter((t) => t.id === tag).length) {
            tagsToUpdate.push(tag);
          } else {
            tagsToCreate.push({
              name: tag,
              account_id: account.id,
              ...(user?.isAdmin ? { created_by: user.id } : null)
            });
          }
        });

        // create tags if necessary
        let createdTags = [];
        if (tagsToCreate.length) {
          let res = await createTags({
            variables: { objects: tagsToCreate }
          });
          createdTags = res.data.insert_tags.returning;
        }

        // convert tags to events_tags objects
        let events_tags = values.event_tags.map((tag) => {
          let tag_id = createdTags.find((t) => t.name === tag)?.id || tag;
          if (tag_id) {
            return {
              event_id,
              tag_id,
              ...(user?.isAdmin ? { created_by: user.id } : null)
            };
          }
        });

        if (events_tags.length) {
          updateEventTags({
            variables: {
              delete_ids: event?.tags?.map((tag) => tag.id) || [],
              objects: events_tags
            }
          });
        }
      } else {
        if (event?.tags?.length) {
          deleteEventTags({
            variables: {
              delete_ids: event?.tags?.map((tag) => tag.id) || []
            }
          });
        }
      }

      let products = values?.events_products?.map((product) => {
        return {
          product_id: product,
          event_id,
          ...(user?.isAdmin ? { created_by: user.id } : null)
        };
      });

      if (products) {
        updateEventProducts({
          variables: {
            delete_ids: data?.events_by_pk?.products.map(
              (product) => product.id
            ),
            objects: products
          }
        });
      } else {
        if (data?.events_by_pk?.products?.length) {
          deleteEventProducts({
            variables: {
              delete_ids: data?.events_by_pk?.products.map(
                (product) => product.id
              )
            }
          });
        }
      }

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
    // @security public..
    setEvent({ ...event, video: step.results[':original'][0].ssl_url });
  };

  const handleUppyError = (res) => {
    message.error('An error occurred during upload.');
    throw res;
  };

  // prevents form creation because it doesn't like to re-render
  if (params.id && !event)
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );

  // form data does not necessarily match db model. we have to reformat
  let eventData = {
    ...event,
    type: event?.type || 'live',
    preview: '',
    range: [moment(event?.start), moment(event?.end)],
    event_tags: event?.tags?.map((tag) => tag.tag.id) || []
  };

  let isVideoMissing = false;

  if (event?.type === 'video' && !event?.video) {
    isVideoMissing = true;
  }

  const isSubmitDisabled = isVideoMissing;

  return (
    <AddEventView
      loading={loading}
      params={params}
      account={account}
      event={event}
      error={error}
      eventData={eventData}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      setEvent={setEvent}
      handleVideoUpload={handleVideoUpload}
      handleUppyError={handleUppyError}
      setCoverType={setCoverType}
      coverType={coverType}
      buttonLabel={buttonLabel}
      handlePhotoUpload={handlePhotoUpload}
      handlePreviewUpload={handlePreviewUpload}
      tags={tags}
      categories={categories}
      isSubmitDisabled={isSubmitDisabled}
      isCreatingEvent={isCreatingEvent}
      isUpdatingEvent={isUpdatingEvent}
    />
  );
}
