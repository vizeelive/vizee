import React, { useState } from 'react';

import FileUpload from 'components/FileUpload';
import CurrencyInput from 'components/CurrencyInput';
import useBreakpoint from 'hooks/useBreakpoint';
import Spinner from 'components/ui/Spinner';
import LocationSearchInput from 'components/LocationSearchInput';
import VideoPlayer from 'components/VideoPlayer';

import { Centered, FormContainer } from 'components/styled/common';

import {
  Divider,
  Typography,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Radio,
  Switch,
  Tooltip
} from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function AddEventView(props) {
  const {
    loading,
    params,
    event,
    account,
    error,
    eventData,
    onFinish,
    onFinishFailed,
    setEvent,
    handleVideoUpload,
    handleUppyError,
    setCoverType,
    coverType,
    handlePhotoUpload,
    handlePreviewUpload,
    tags,
    categories,
    isSubmitDisabled,
    isCreatingEvent,
    isUpdatingEvent,
    buttonLabel
  } = props;

  const [accountOnly, setAccountOnly] = useState(event?.account_only);

  const [advancedPricing, setAdvancedPricing] = useState(
    !!event?.products?.length
  );

  // to determine form layout
  const isLargeScreen = useBreakpoint('lg');

  const layout = 'vertical';

  // const formLayout = isLargeScreen
  //   ? {
  //       labelCol: { span: 10 },
  //       wrapperCol: { span: 20 }
  //     }
  //   : null;

  const formLayout = null;

  const tailLayout = isLargeScreen
    ? {
        wrapperCol: { offset: 4, span: 20 }
      }
    : null;

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  let uploadPhotoOptions = {
    allowedFileTypes: ['image/*']
  };

  let uploadVideoOptions = {
    allowedFileTypes: ['video/*', 'audio/*']
  };

  eventData.events_products = event?.products?.map(
    (product) => product.product.id
  );

  let videoJsOptions = {
    autoplay: false,
    controls: true,
    aspectRatio: '16:9',
    sources: [{ src: event?.preview, type: 'application/x-mpegurl' }]
  };

  return (
    <article className="min-h-page">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <FormContainer>
          {!params.id && <Title level={2}>Add Media</Title>}
          {params.id && <Title level={2}>{event.name}</Title>}

          <Divider />

          <Form
            {...formLayout}
            name="basic"
            layout={layout}
            initialValues={eventData}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="Event Type" name="type">
              <Radio.Group
                value={layout}
                onChange={(e) => setEvent({ ...event, type: e.target.value })}
              >
                <Radio.Button value="live">Live</Radio.Button>
                <Radio.Button value="conference">Conference</Radio.Button>
                <Radio.Button value="video">Video</Radio.Button>
                <Radio.Button value="audio">Audio</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {['video', 'audio'].includes(event?.type) && (
              <Form.Item>
                {event?.video ? (
                  <React.Fragment>
                    <video
                      src={event.video}
                      width="300px"
                      alt="event"
                      controls
                    />
                    <Button onClick={() => setEvent({ ...event, video: null })}>
                      Replace Video
                    </Button>
                  </React.Fragment>
                ) : (
                  <FileUpload
                    id="video"
                    success={handleVideoUpload}
                    error={handleUppyError}
                    options={uploadVideoOptions}
                  />
                )}
              </Form.Item>
            )}

            <div className="mb-5">
              <div className="ant-col ant-form-item-label">
                <label>Preview</label>
              </div>

              <div>
                <Radio.Group
                  onChange={(e) => setCoverType(e.target.value)}
                  optionType="button"
                  value={coverType}
                >
                  <Radio.Button value="">None</Radio.Button>
                  <Radio.Button value="Photo">Photo</Radio.Button>
                  <Radio.Button value="Video">Video</Radio.Button>
                </Radio.Group>
              </div>
            </div>

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
                    success={handlePhotoUpload}
                    error={handleUppyError}
                    options={uploadPhotoOptions}
                  />
                )}
              </Form.Item>
            )}
            {coverType === 'Video' && (
              <Form.Item>
                {event?.preview ? (
                  <React.Fragment>
                    <VideoPlayer key={Math.random()} {...videoJsOptions} />
                    <Button
                      onClick={() => setEvent({ ...event, preview: null })}
                    >
                      Replace Preview
                    </Button>
                  </React.Fragment>
                ) : (
                  <FileUpload
                    id="preview"
                    success={handlePreviewUpload}
                    error={handleUppyError}
                    options={uploadVideoOptions}
                  />
                )}
              </Form.Item>
            )}

            <Form.Item
              name="start"
              label={
                <span>
                  Available Start&nbsp;
                  <Tooltip title="The date this media becomes available. Time must be set in UTC.">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
            >
              <DatePicker format="MM-DD-YYYY HH:mm a" />
            </Form.Item>

            <Form.Item
              name="end"
              label={
                <span>
                  Available End&nbsp;
                  <Tooltip title="The date this media becomes unavailable if set. Time must be set in UTC.">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
            >
              <DatePicker format="MM-DD-YYYY HH:mm a" />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="account_only"
              label="Full Account Access Only"
              valuePropName="checked"
            >
              <Switch
                onChange={() => {
                  let val = !accountOnly;
                  if (val) {
                    setAdvancedPricing(false);
                  }
                  setAccountOnly(val);
                }}
              />
            </Form.Item>

            {!accountOnly && !advancedPricing && (
              <Form.Item
                style={{ marginBottom: '0px' }}
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Required' }]}
              >
                <CurrencyInput
                  className="ant-input"
                  style={{ maxWidth: '10rem' }}
                />
              </Form.Item>
            )}

            {!accountOnly && !advancedPricing && (
              // eslint-disable-next-line
              <a onClick={() => setAdvancedPricing(true)}>
                Show Advanced Pricing Options
              </a>
            )}

            {advancedPricing ? (
              <Form.Item
                style={{ marginBottom: '0px' }}
                name="events_products"
                label="Products"
              >
                <Select
                  showSearch
                  mode="multiple"
                  allowClear
                  optionLabelProp="label"
                  placeholder="Select a product"
                  options={account.products.map((product) => {
                    return { label: product.name, value: product.id };
                  })}
                />
              </Form.Item>
            ) : null}

            {advancedPricing ? (
              // eslint-disable-next-line
              <a href="#" onClick={() => setAdvancedPricing(false)}>
                Hide Advanced Pricing Options
              </a>
            ) : null}

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
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="event_tags"
              label="Tags"
              rules={[{ required: false }]}
            >
              <Select mode="tags" style={{ width: '100%' }} placeholder="Tags">
                {tags?.map((tag) => {
                  return <Option key={tag.id}>{tag.name}</Option>;
                })}
              </Select>
            </Form.Item>

            <Form.Item label="Location" name="location">
              <LocationSearchInput address={eventData.location} />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="published"
              label="Published"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="on_network"
              label="Display on Vizee Network"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Centered style={{ padding: '1rem' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isCreatingEvent || isUpdatingEvent}
                  disabled={isSubmitDisabled}
                  size="large"
                >
                  {buttonLabel}
                </Button>
              </Centered>
            </Form.Item>
          </Form>
        </FormContainer>
      </div>
    </article>
  );
}
