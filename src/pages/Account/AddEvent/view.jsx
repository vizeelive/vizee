import React from 'react';

import FileUpload from 'components/FileUpload';
import CurrencyInput from 'components/CurrencyInput';
import useBreakpoint from 'hooks/useBreakpoint';
import Spinner from 'components/ui/Spinner';
import LocationSearchInput from 'components/LocationSearchInput';

import { Centered, FormContainer } from 'components/styled/common';

import {
  Divider,
  Typography,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Radio
} from 'antd';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AddEventView(props) {
  const {
    loading,
    params,
    event,
    error,
    eventData,
    onFinish,
    setEvent,
    handleVideoUpload,
    handleUppyError,
    setCoverType,
    coverType,
    handlePhotoUpload,
    handlePreviewUpload,
    categories,
    isSubmitDisabled,
    isCreatingEvent,
    isUpdatingEvent,
    buttonLabel
  } = props;

  // to determine form layout
  const isLargeScreen = useBreakpoint('lg');

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

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }]
  };

  let uploadPhotoOptions = {
    allowedFileTypes: ['image/*']
  };

  let uploadVideoOptions = {
    allowedFileTypes: ['video/*']
  };

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
                success={handleVideoUpload}
                error={handleUppyError}
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
                <video src={event.preview} width="300px" alt="event" controls />
                <Button onClick={() => setEvent({ ...event, preview: null })}>
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
  );
}
