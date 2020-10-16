import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import useAuth from '../hooks/useAuth';

import FileUpload from '../components/FileUpload';
import useBreakpoint from '../hooks/useBreakpoint';
import Spinner from '../components/ui/Spinner';

import { Centered, FormContainer } from '../components/styled/common';

import { Form, Input, Button, message } from 'antd';

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($object: CreateAccountInput!) {
    CreateAccount(object: $object) {
      id
      username
    }
  }
`;

const GET_ACCOUNT = gql`
  query GetAccount($id: uuid!) {
    accounts_by_pk(id: $id) {
      id
      description
      facebook
      instagram
      name
      photo
      twitter
      username
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount(
    $pk_columns: accounts_pk_columns_input!
    $_set: accounts_set_input!
  ) {
    update_accounts_by_pk(_set: $_set, pk_columns: $pk_columns) {
      id
      description
      facebook
      instagram
      name
      photo
      twitter
      username
    }
  }
`;

export default function AddAccount(props) {
  const params = useParams();
  const { user } = useAuth();
  const history = useHistory();
  const [validationErrors, setValidationErrors] = useState({});
  const [replacePhoto, setReplacePhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loadAccount, { loading, error, data }] = useLazyQuery(GET_ACCOUNT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: params.id
    }
  });
  const [createAccount] = useMutation(CREATE_ACCOUNT);
  const [updateAccount] = useMutation(UPDATE_ACCOUNT);

  useEffect(() => {
    async function getData() {
      await loadAccount();
    }
    if (params.id) {
      getData();
    }
  }, [loadAccount, params]);

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

  const account = data?.accounts_by_pk;
  const isSubmitDisabled = !photoUrl && !account?.photo;

  const onFinish = async (values) => {
    let photo = photoUrl || account?.photo;
    if (!photo) {
      message.error('Photo is required to create an account');
      return;
    }
    let result;
    try {
      if (params.id) {
        result = await updateAccount({
          variables: {
            pk_columns: { id: params.id },
            _set: {
              name: values.name,
              username: values.username,
              description: values.description,
              instagram: values.instagram,
              twitter: values.twitter,
              facebook: values.facebook,
              photo
            }
          }
        });
      } else {
        result = await createAccount({
          variables: {
            object: {
              name: values.name,
              username: values.username,
              description: values.description,
              instagram: values.instagram,
              twitter: values.twitter,
              facebook: values.facebook,
              photo,
              user_id: user.sub
            }
          }
        });
      }
    } catch (e) {
      if (e.graphQLErrors[0].message.includes('duplicate')) {
        setValidationErrors({ username: 'Username is already taken' });
        return;
      }
      if (e.graphQLErrors[0].extensions.code.includes('validation-error')) {
        setValidationErrors(JSON.parse(e.graphQLErrors[0].message));
        return;
      }
    }

    if (result) {
      message.success('Successfully created account');
      if (props.redirect) {
        history.push(`/${result.data.CreateAccount.username}`);
      } else {
        history.push('/admin/accounts');
      }
    } else {
      message.error('Failed to create account');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleFileUpload = (step) => {
    setPhotoUrl(step.uploads[0].ssl_url);
    setReplacePhoto(false);
  };

  const handleReplacePhoto = () => {
    setPhotoUrl(null);
    setReplacePhoto(true);
  };

  let options = {
    allowedFileTypes: ['image/*']
  };

  const layout = isLargeScreen ? 'horizontal' : 'vertical';

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
          validateStatus={validationErrors.instagram ? 'error' : 'success'}
          help={validationErrors.instagram ?? null}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Twitter"
          name="twitter"
          validateStatus={validationErrors.twitter ? 'error' : 'success'}
          help={validationErrors.twitter ?? null}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Facebook"
          name="facebook"
          validateStatus={validationErrors.facebook ? 'error' : 'success'}
          help={validationErrors.facebook ?? null}
        >
          <Input />
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
          <Form.Item label="Photo">
            <FileUpload
              id="photo"
              callback={handleFileUpload}
              options={options}
            />
          </Form.Item>
        )}

        <Form.Item {...tailLayout}>
          <Centered>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitDisabled}
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
