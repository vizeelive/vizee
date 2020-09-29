import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

import FileUpload from "../components/FileUpload";

import { gql, useMutation } from "@apollo/client";

const CREATE_ACCOUNT = gql`
  mutation MyMutation($object: accounts_insert_input!) {
    insert_accounts_one(object: $object) {
      id
      name
      photo
      username
    }
  }
`;

export default function AddAccount(props) {
  const history = useHistory();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [createAccount] = useMutation(CREATE_ACCOUNT);

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
    } catch (e) {
      if (e.graphQLErrors[0].message.includes("duplicate")) {
        message.error("That account name is already taken");
        return;
      }
    }

    if (account) {
      message.success("Successfully created account");
      if (props.redirect) {
        history.push(`/${account.data.insert_accounts_one.username}`);
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
    console.log(step);
  };

  let options = {
    allowedFileTypes: ["image/*"],
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
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
        rules={[{ required: true, message: "Required" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input />
      </Form.Item>

      <Form.Item label="Instagram" name="instagram">
        <Input />
      </Form.Item>

      <Form.Item label="Twitter" name="twitter">
        <Input />
      </Form.Item>

      <Form.Item label="Facebook" name="facebook">
        <Input />
      </Form.Item>

      <Form.Item label="Photo">
        <FileUpload id="photo" callback={handleFileUpload} options={options} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}
