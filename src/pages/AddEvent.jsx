import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

import FileUpload from '../components/FileUpload';
import CurrencyInput from '../components/CurrencyInput';
import useBreakpoint from '../hooks/useBreakpoint';
import Spinner from '../components/ui/Spinner';
import LocationSearchInput from '../components/LocationSearchInput';

import { Centered, FormContainer } from '../components/styled/common';

import {
  Divider,
  Typography,
  Form,
  Input,
  Button,
  message,
  DatePicker,
  Select,
  Radio
} from 'antd';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  const [createEvent] = useMutation(CREATE_EVENT);
  const [updateEvent] = useMutation(UPDATE_EVENT);

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

  // to determine form layout
  const isLargeScreen = useBreakpoint('lg');

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const { accounts, categories } = data;
  const account = data.account[0];

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
    } else {
      newEvent = await createEvent({
        variables: {
          object: data
        }
      });
    }

    if (newEvent) {
      message.success('Successfully saved event');
      history.push(redirect);
    } else {
      message.error('Failed to save event');
    }
  };

  const handlePhotoUpload = (step) => {
    setEvent({ ...event, photo: step.uploads[0].ssl_url });
  };

  const handlePreviewUpload = (step) => {
    setEvent({ ...event, preview: step.uploads[0].ssl_url });
  };

  const handleVideoUpload = (step) => {
    setEvent({ ...event, video: step.uploads[0].ssl_url });
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

  let isSubmitDisabled = false;

  if (event?.type === 'video' && !event?.video) {
    isSubmitDisabled = true;
  }

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }]
  };

  let uploadPhotoOptions = {
    allowedFileTypes: ['image/*']
  };

  let uploadVideoOptions = {
    allowedFileTypes: ['video/*']
  };

  const layout = 'vertical';

  const formLayout = isLargeScreen
    ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
    : null;

  const tailLayout = isLargeScreen
    ? {
        wrapperCol: { offset: 4, span: 20 }
      }
    : null;

  return (
    <FormContainer>
      {!params.id && <Title level={2}>Add An Event</Title>}
      {params.id && <Title level={2}>{event.name}</Title>}

      <Divider />

      <Form
        {...formLayout}
        name="basic"
        layout={layout}
        initialValues={eventData}
        onFinish={onFinish}
      >
        <Form.Item label="Event Type" name="type">
          <Radio.Group
            value={layout}
            onChange={(e) => setEvent({ ...event, type: e.target.value })}
          >
            <Radio.Button value="live">Live</Radio.Button>
            <Radio.Button value="conference">Conference</Radio.Button>
            <Radio.Button value="video">Video</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {event?.type === 'video' && (
          <Form.Item>
            {event?.video ? (
              <React.Fragment>
                <video src={event.video} width="300px" alt="event" controls />
                <Button onClick={() => setEvent({ ...event, video: null })}>
                  Replace Video
                </Button>
              </React.Fragment>
            ) : (
              <FileUpload
                id="video"
                callback={handleVideoUpload}
                options={uploadVideoOptions}
              />
            )}
          </Form.Item>
        )}

        <Form.Item label="Preview" name="preview">
          <Radio.Group
            onChange={(e) => setCoverType(e.target.value)}
            optionType="button"
            value={coverType || ''}
          >
            <Radio.Button value="">None</Radio.Button>
            <Radio.Button value="Photo">Photo</Radio.Button>
            <Radio.Button value="Video">Video</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {coverType === 'Photo' && (
          <Form.Item>
            {event?.photo ? (
              <React.Fragment>
                <img src={event.photo} width="300px" alt="event" />
                <Button onClick={() => setEvent({ ...event, photo: null })}>
                  Replace Photo
                </Button>
              </React.Fragment>
            ) : (
              <FileUpload
                id="photo"
                callback={handlePhotoUpload}
                options={uploadPhotoOptions}
              />
            )}
          </Form.Item>
        )}
        {coverType === 'Video' && (
          <Form.Item>
            {event?.preview ? (
              <React.Fragment>
                <video src={event.preview} width="300px" alt="event" controls />
                <Button onClick={() => setEvent({ ...event, preview: null })}>
                  Replace Preview
                </Button>
              </React.Fragment>
            ) : (
              <FileUpload
                id="preview"
                callback={handlePreviewUpload}
                options={uploadVideoOptions}
              />
            )}
          </Form.Item>
        )}

        <Form.Item name="range" label="Event Times" {...rangeConfig}>
          <RangePicker showTime format="MM-DD-YYYY HH:mm a" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Required' }]}
        >
          <CurrencyInput className="ant-input" style={{ maxWidth: '10rem' }} />
        </Form.Item>

        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a category"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Location" name="location">
          <LocationSearchInput address={eventData.location} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        {!params.username && (
          <Form.Item name="account_id" label="Account">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select an account"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {accounts.map((account) => (
                <Option key={account.id} value={account.id}>
                  {account.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item name="published" label="Published">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a publish status"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option key="published" value={true}>
              Yes
            </Option>
            <Option key="unpublished" value={false}>
              No
            </Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Centered style={{ padding: '1rem' }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitDisabled}
              size="large"
            >
              {buttonLabel}
            </Button>
          </Centered>
        </Form.Item>
      </Form>
    </FormContainer>
  );
}
