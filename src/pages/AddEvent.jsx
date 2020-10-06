import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams, useHistory } from "react-router-dom";
import { Form, Input, Button, message, DatePicker, Select, Radio } from "antd";

import { Centered } from "../components/styled/common";
import Spinner from "../components/ui/Spinner";

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

export default function AddEvent() {
  const params = useParams();
  const history = useHistory();

  let query;
  let options;
  let title;
  let buttonLabel;

  if (params.id) {
    query = GET_EVENT;
    options = {
      fetchPolicy: "cache-and-network",
      variables: { id: params.id },
    };
    title = "Edit Event";
    buttonLabel = "Update Event";
  } else {
    query = GET_ACCOUNTS;
    options = {};
    title = "Add An Event";
    buttonLabel = "Save Event";
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
            video: event?.video,
            preview: event?.preview,
            photo: event?.photo,
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
            video: event?.video,
            preview: event?.preview,
            photo: event?.photo,
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
  if (params.id && !event) return "Loading...";

  // preloads date range
  let eventData = { ...event, range: [moment(event?.start), moment(event?.end)] };

  const isSubmitDisabled =
    (event?.type === "Video" && !event?.video) ||
    (!event?.preview && !event?.photo);

  const rangeConfig = {
    rules: [{ type: "array", required: true, message: "Please select time!" }],
  };

  let uploadPhotoOptions = {
    allowedFileTypes: ["image/*"],
  };

  let uploadVideoOptions = {
    allowedFileTypes: ["video/*"],
  };

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <React.Fragment>
      <h2>{title}</h2>
      <hr />
      <br />

      <Form
        {...layout}
        name="basic"
        initialValues={eventData}
        onFinish={onFinish}
      >
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
            // defaultValue={event?.category_id}
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
            onChange={(e) => setEvent({ ...event, type: e.target.value })}
            optionType="button"
            value={event?.type}
          />
          {event?.type === "video" && (
            <React.Fragment>
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
            </React.Fragment>
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
          {coverType === "Video" && (
            <React.Fragment>
              {event?.preview ? (
                <React.Fragment>
                  <video
                    src={event.preview}
                    width="300px"
                    alt="event"
                    controls
                  />
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
            </React.Fragment>
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
