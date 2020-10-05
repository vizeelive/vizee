import React, { useEffect, useState } from "react";
// import moment from "moment";
import { useParams, useHistory } from "react-router-dom";
import { Form, Input, Button, message, DatePicker, Select, Radio } from "antd";

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

import { gql, useQuery, useMutation } from "@apollo/client";

import FileUpload from "../components/FileUpload";
import CurrencyInput from "../components/CurrencyInput";

const { Option } = Select;

const { RangePicker } = DatePicker;

const GET_ACCOUNTS = gql`
  query GetAccounts {
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
  query GetEvent($id: uuid!) {
    events_by_pk(id: $id) {
      id
      name
      start
      end
      description
      price
      account_id
      category_id
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
      name
      end
      price
      start
      account_id
      description
    }
  }
`;

export default function AddEvent() {
  const params = useParams();
  const history = useHistory();

  let query;
  let options;
  let title;
  let buttonLabel;

  if (params.id) {
    query = GET_EVENT;
    options = { variables: { id: params.id } };
    title = "Edit Event";
    buttonLabel = "Update Event";
  } else {
    query = GET_ACCOUNTS;
    options = {};
    title = "Add An Event";
    buttonLabel = "Save Event";
  }

  const [eventType, setEventType] = useState("live");
  const [coverType, setCoverType] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const { loading, error, data } = useQuery(query, options);
  const [createEvent] = useMutation(CREATE_EVENT);
  const [updateEvent] = useMutation(UPDATE_EVENT);

  const event = data?.events_by_pk;

  useEffect(() => {
    if (event) {
      if (event.preview) {
        setCoverType("Video");
      } else {
        setCoverType("Photo");
      }
    }
  }, [event]);

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return "Error";

  const { accounts, categories } = data;

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = async (values) => {
    let [start, end] = values.range;

    let newEvent;
    if (params.id) {
      newEvent = await updateEvent({
        variables: {
          pk_columns: { id: params.id },
          _set: {
            name: values.name,
            price: values.price,
            description: values.description,
            category_id: values.category_id,
            account_id: values.account_id,
            video: videoUrl || event?.video,
            preview: previewUrl || event?.preview,
            photo: photoUrl || event?.photo,
            start,
            end,
          },
        },
      });
    } else {
      newEvent = await createEvent({
        variables: {
          object: {
            name: values.name,
            price: values.price,
            description: values.description,
            category_id: values.category_id,
            account_id: values.account_id,
            video: videoUrl || event?.video,
            preview: previewUrl || event?.preview,
            photo: photoUrl || event?.photo,
            start,
            end,
          },
        },
      });
    }

    if (newEvent) {
      message.success("Successfully created event");
      history.push("/admin/events");
    } else {
      message.error("Failed to create event");
    }
  };

  const rangeConfig = {
    rules: [{ type: "array", required: true, message: "Please select time!" }],
  };

  const handlePhotoUpload = (step) => {
    setPhotoUrl(step.uploads[0].ssl_url);
  };

  const handlePreviewUpload = (step) => {
    setPreviewUrl(step.uploads[0].ssl_url);
  };

  const handleVideoUpload = (step) => {
    setVideoUrl(step.uploads[0].ssl_url);
  };

  let uploadPhotoOptions = {
    allowedFileTypes: ["image/*"],
  };

  let uploadVideoOptions = {
    allowedFileTypes: ["video/*"],
  };

  const isSubmitDisabled =
    (eventType === "Video" && !videoUrl) || (!previewUrl && !photoUrl);

  return (
    <React.Fragment>
      <h2>{title}</h2>
      <hr />
      <br />

      <Form {...layout} name="basic" initialValues={event} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Required" }]}
        >
          <CurrencyInput />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="range" label="Event Times" {...rangeConfig}>
          <RangePicker
            showTime
            format="MM-DD-YYYY HH:mm:ss"
            // defaultValue={[moment(event.start), moment(event.end)]}
          />
        </Form.Item>

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

        <Form.Item name="category_id" label="Category">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a category"
            optionFilterProp="children"
            defaultValue={event?.category_id}
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

        <Form.Item label="Event Type">
          <Radio.Group
            options={[
              { label: "Live", value: "live" },
              { label: "Video", value: "video" },
            ]}
            onChange={(e) => setEventType(e.target.value)}
            optionType="button"
            value={eventType}
          />
          {eventType === "video" && (
            <Form.Item label="Video Deliverable">
              <FileUpload
                id="video"
                callback={handleVideoUpload}
                options={uploadVideoOptions}
              />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item label="Preview">
          <Radio.Group
            options={[
              { label: "Photo", value: "Photo" },
              { label: "Video", value: "Video" },
            ]}
            onChange={(e) => setCoverType(e.target.value)}
            optionType="button"
            value={coverType}
          />
          {coverType === "Photo" && (
            <Form.Item label="Photo">
              <FileUpload
                id="photo"
                callback={handlePhotoUpload}
                options={uploadPhotoOptions}
              />
            </Form.Item>
          )}
          {coverType === "Video" && (
            <Form.Item label="Video">
              <FileUpload
                id="preview"
                callback={handlePreviewUpload}
                options={uploadVideoOptions}
              />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item {...tailLayout}>
          {isSubmitDisabled ? (
            <Button type="primary" htmlType="submit" disabled>
              {buttonLabel}
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              {buttonLabel}
            </Button>
          )}
        </Form.Item>
      </Form>
    </React.Fragment>
  );
}
