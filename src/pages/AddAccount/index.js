import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import useAuth from 'hooks/useAuth';
import { SocialLinks } from 'social-links';
import { message } from 'antd';

import AddAccountView from './view';

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
      logo
      photo
      twitter
      username
      whitelabel
      store_url
    }
  }
`;

const GET_ACCOUNT_ADMIN = gql`
  query GetAccount($id: uuid!) {
    accounts_by_pk(id: $id) {
      id
      description
      facebook
      instagram
      name
      logo
      photo
      twitter
      username
      whitelabel
      fee_percent
      store_url
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: uuid!, $object: UpdateAccountInput!) {
    UpdateAccount(id: $id, object: $object) {
      id
      username
    }
  }
`;

export default function AddAccount(props) {
  const params = useParams();
  const { user } = useAuth();
  const history = useHistory();
  const [validationErrors, setValidationErrors] = useState({});
  const [replaceLogo, setReplaceLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [replacePhoto, setReplacePhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loadAccount, { loading, error, data }] = useLazyQuery(
    user?.isAdmin ? GET_ACCOUNT_ADMIN : GET_ACCOUNT,
    {
      variables: {
        id: params.id
      }
    }
  );
  const [createAccount, { loading: isCreatingAccount }] = useMutation(
    CREATE_ACCOUNT
  );
  const [updateAccount, { loading: isUpdatingAccount }] = useMutation(
    UPDATE_ACCOUNT
  );

  useEffect(() => {
    async function getData() {
      await loadAccount();
    }
    if (params.id) {
      getData();
    }
  }, [loadAccount, params]);

  const account = data?.accounts_by_pk;
  const isSubmitDisabled = false;
  // const isSubmitDisabled = !photoUrl && !account?.photo;

  const onFinish = async (values) => {
    let photo = photoUrl || account?.photo;
    let logo = logoUrl || account?.logo;

    if (values.instagram) {
      values.instagram = new SocialLinks().sanitize(
        'instagram',
        values.instagram
      );
    }
    if (values.twitter) {
      values.twitter = new SocialLinks().sanitize('twitter', values.twitter);
    }
    if (values.facebook) {
      values.facebook = new SocialLinks().sanitize('facebook', values.facebook);
    }

    // if (!photo) {
    //   message.error('Photo is required to create an account');
    //   return;
    // }

    let result;
    try {
      if (params.id) {
        result = await updateAccount({
          variables: {
            id: params.id,
            object: {
              name: values.name,
              username: values.username,
              description: values.description,
              whitelabel: values.whitelabel,
              instagram: values.instagram,
              twitter: values.twitter,
              facebook: values.facebook,
              store_url: values.store_url,
              ...(logo ? { logo } : null),
              ...(photo ? { photo } : null),
              ...(user?.isAdmin ? { fee_percent: values.fee_percent } : null)
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
              whitelabel: values.whitelabel,
              instagram: values.instagram,
              twitter: values.twitter,
              facebook: values.facebook,
              store_url: values.store_url,
              logo,
              photo,
              user_id: user.id
            }
          }
        });
      }
    } catch (e) {
      if (e.graphQLErrors[0].message.includes('duplicate')) {
        let msg = 'Username is already taken';
        setValidationErrors({ username: msg });
        message.error(msg);
        return;
      }
      if (e.graphQLErrors[0].extensions.code.includes('validation-error')) {
        setValidationErrors(JSON.parse(e.graphQLErrors[0].message));
        return;
      }
    }

    if (result) {
      let username =
        result?.data?.CreateAccount?.username ||
        result?.data?.UpdateAccount?.username;
      window.mixpanel.track('Account Created');
      message.success('Successfully saved account');
      if (props.redirect === true) {
        history.push(`/${username}/manage/dashboard`);
      } else if (props.redirect) {
        history.push(props.redirect);
      } else {
        history.push('/admin/accounts');
      }
    } else {
      message.error('Failed to save account');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleFileUpload = (step) => {
    setPhotoUrl(step.uploads[0].ssl_url);
    setReplacePhoto(false);
  };

  const handleLogoUpload = (step) => {
    setLogoUrl(step.uploads[0].ssl_url);
    setReplaceLogo(false);
  };

  const handleFileUploadError = (err) => {
    message.error('An error occurred');
    throw err;
  };

  const handleReplacePhoto = () => {
    setPhotoUrl(null);
    setReplacePhoto(true);
  };

  const handleReplaceLogo = () => {
    setLogoUrl(null);
    setReplaceLogo(true);
  };

  return (
    <AddAccountView
      loading={loading}
      error={error}
      account={account}
      user={user}
      params={params}
      logoUrl={logoUrl}
      replaceLogo={replaceLogo}
      handleReplaceLogo={handleReplaceLogo}
      photoUrl={photoUrl}
      replacePhoto={replacePhoto}
      handleReplacePhoto={handleReplacePhoto}
      handleFileUploadError={handleFileUploadError}
      handleFileUpload={handleFileUpload}
      handleLogoUpload={handleLogoUpload}
      onFinishFailed={onFinishFailed}
      onFinish={onFinish}
      isSubmitDisabled={isSubmitDisabled}
      isCreatingAccount={isCreatingAccount}
      isUpdatingAccount={isUpdatingAccount}
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
    />
  );
}
