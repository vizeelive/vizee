import React from 'react';

import Linkify from 'react-linkify';

import styled from 'styled-components';
import {
  Typography,
  Card,
  Button,
  Switch,
  Modal,
  Form,
  Input,
  Popconfirm
} from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LinkCard = styled(Card)`
  margin-bottom: 10px;
`;

const CardSwitch = styled(Switch)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const ActionsMenu = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;

  .anticon {
    margin-left: 10px;
  }
`;

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
    }
  }
`;

export default function LinksView(props) {
  const {
    showModal,
    setShowModal,
    links,
    isSwitchLoading,
    handleToggleEnabled,
    handleClickEdit,
    handleClickDelete,
    onFinish,
    form
  } = props;

  return (
    <article className="min-h-page">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Header>
          <Title level={3}>Links</Title>
          <Button type="primary" onClick={() => setShowModal(true)}>
            Add Link
          </Button>
        </Header>
        {links.map((link) => (
          <LinkCard>
            <CardSwitch
              loading={isSwitchLoading[link.id]}
              checked={link.enabled}
              onChange={(enabled) => handleToggleEnabled(link, enabled)}
            />
            <ActionsMenu>
              <EditOutlined onClick={() => handleClickEdit(link)} />
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => handleClickDelete(link.id)}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined />
              </Popconfirm>
            </ActionsMenu>
            <h4>{link.name}</h4>
            <h5>
              <Linkify>{link.link}</Linkify>
            </h5>
          </LinkCard>
        ))}

        <Modal
          title="Create Link"
          visible={showModal}
          footer={null}
          onCancel={() => setShowModal(false)}
        >
          <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
            <Form.Item name="id"></Form.Item>
            <Form.Item
              label="Title"
              name="name"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Link"
              name="link"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="enabled"
              label="Enabled"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
            <Button key="submit" htmlType="submit" type="primary" size="large">
              Save Link
            </Button>
          </Form>
        </Modal>
      </div>
    </article>
  );
}
