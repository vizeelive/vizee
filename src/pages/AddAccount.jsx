import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

import FileUpload from "../components/FileUpload";

import { gql, useMutation, useLazyQuery } from "@apollo/client";

import { Centered } from "../components/styled/common";
import Spinner from "../components/ui/Spinner";

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
  const history = useHistory();
  const [validationErrors, setValidationErrors] = useState({});
  const [replacePhoto, setReplacePhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loadAccount, { loading, error, data }] = useLazyQuery(GET_ACCOUNT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: params.id,
    },
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

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return "Error";

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = async (values) => {
    if (!photoUrl) {
      message.error("Photo is required to create an account");
      return;
    }
    let account;
    try {
      if (params.id) {
        account = await updateAccount({
          variables: {
            pk_columns: { id: params.id },
            _set: {
              name: values.name,
              username: values.username,
              description: values.description,
              instagram: values.instagram,
              twitter: values.twitter,
              facebook: values.facebook,
              photo: photoUrl,
            },
          },
        });
      } else {
        account = await createAccount({
          variables: {
            object: {
              name: values.name,
              username: values.username,
              description: values.description,
              instagram: values.instagram,
              twitter: values.twitter,
              facebook: values.facebook,
              photo: photoUrl,
            },
          },
        });
      }
    } catch (e) {
      if (e.graphQLErrors[0].message.includes("duplicate")) {
        setValidationErrors({ username: "Username is already taken" });
        return;
      }
      if (e.graphQLErrors[0].extensions.code.includes("validation-error")) {
        setValidationErrors(JSON.parse(e.graphQLErrors[0].message));
        return;
      }
    }

    if (account) {
      message.success("Successfully created account");
      if (props.redirect) {
        history.push(`/${account.data.CreateAccount.username}`);
      } else {
        history.push("/admin/accounts");
      }
    } else {
      message.error("Failed to create account");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
    allowedFileTypes: ["image/*"],
  };

  const account = data?.accounts_by_pk;
  const isSubmitDisabled = !photoUrl;

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={account}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        validateStatus={validationErrors.username ? "error" : "success"}
        help={validationErrors.username ?? null}
        rules={[{ required: true, message: "Required" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input />
      </Form.Item>

      <Form.Item
        label="Instagram"
        name="instagram"
        validateStatus={validationErrors.instagram ? "error" : "success"}
        help={validationErrors.instagram ?? null}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Twitter"
        name="twitter"
        validateStatus={validationErrors.twitter ? "error" : "success"}
        help={validationErrors.twitter ?? null}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Facebook"
        name="facebook"
        validateStatus={validationErrors.facebook ? "error" : "success"}
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
        <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
          { params?.id ? 'Update' : 'Add'}
        </Button>
      </Form.Item>
    </Form>
  );
}
