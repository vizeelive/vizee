import React from 'react';
import { SocialLinks } from 'social-links';

import FileUpload from 'components/FileUpload';
import useBreakpoint from 'hooks/useBreakpoint';
import Spinner from 'components/ui/Spinner';

import { Centered, FormContainer } from 'components/styled/common';

import { Form, Input, Button } from 'antd';

export default function AddAccountView(props) {
  const {
    loading,
    error,
    account,
    user,
    params,
    photoUrl,
    replacePhoto,
    handleReplacePhoto,
    handleFileUploadError,
    handleFileUpload,
    onFinishFailed,
    onFinish,
    isSubmitDisabled,
    isCreatingAccount,
    validationErrors
  } = props;

  const isLargeScreen = useBreakpoint('lg');

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  // to determine form layout
  let options = {
    allowedFileTypes: ['image/*']
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
      <Form
        {...formLayout}
        name="basic"
        layout={layout}
        initialValues={account}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          validateStatus={validationErrors.username ? 'error' : 'success'}
          help={validationErrors.username ?? null}
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>

        {user?.isAdmin && (
          <Form.Item
            label="Fee Percent"
            name="fee_percent"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Instagram"
          name="instagram"
          help={validationErrors.instagram ?? null}
          rules={[
            {},
            () => ({
              validator(rule, value) {
                if (!value || new SocialLinks().isValid('instagram', value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject('Invalid Instagram link');
                }
              }
            })
          ]}
        >
          <Input placeholder="username" />
        </Form.Item>

        <Form.Item
          label="Twitter"
          name="twitter"
          help={validationErrors.twitter ?? null}
          rules={[
            {},
            () => ({
              validator(rule, value) {
                if (!value || new SocialLinks().isValid('twitter', value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject('Invalid Twitter link');
                }
              }
            })
          ]}
        >
          <Input placeholder="username" />
        </Form.Item>

        <Form.Item
          label="Facebook"
          name="facebook"
          help={validationErrors.facebook ?? null}
          rules={[
            {},
            () => ({
              validator(rule, value) {
                if (!value || new SocialLinks().isValid('facebook', value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject('Invalid Facebook link');
                }
              }
            })
          ]}
        >
          <Input placeholder="username" />
        </Form.Item>

        {!replacePhoto && !photoUrl && account?.photo && (
          <Form.Item label="Photo">
            <img src={account.photo} alt="Account" width="300" />
            <Button onClick={() => handleReplacePhoto()}>Replace Photo</Button>
          </Form.Item>
        )}

        {!replacePhoto && photoUrl && (
          <Form.Item label="Photo">
            <img src={photoUrl} alt="Account" width="300" />
            <Button onClick={() => handleReplacePhoto()}>Replace Photo</Button>
          </Form.Item>
        )}

        {(replacePhoto || (!photoUrl && !account?.photo)) && (
          <Form.Item label="Cover Photo">
            <FileUpload
              id="photo"
              success={handleFileUpload}
              error={handleFileUploadError}
              options={options}
            />
          </Form.Item>
        )}

        <Form.Item {...tailLayout}>
          <Centered>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitDisabled || isCreatingAccount}
              size="large"
            >
              {`${params?.id ? 'Update' : 'Add'} Account`}
            </Button>
          </Centered>
        </Form.Item>
      </Form>
    </FormContainer>
  );
}
