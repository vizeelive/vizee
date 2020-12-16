import config from 'config';
import React, { useState } from 'react';
import { stringify } from 'zipson';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';

import { Button, Modal, message, Form, Input } from 'antd';
import { TagOutlined, StarOutlined } from '@ant-design/icons';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PurchaseOption = styled.div`
  border: 1px solid #333333;
  margin-bottom: 20px;
  padding: 20px;
`;

export default function BuyButton(props) {
  const { event, user } = props;
  const [form] = Form.useForm();
  const [product, setProduct] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const buy = async (params = {}) => {
    const { product, values } = params;

    let ref = encodeURIComponent(
      stringify({
        user_id: user?.id,
        event_id: event.id,
        product_id: product.id,
        email: values?.email
      })
    );

    const stripe = await stripePromise;

    const response = await fetch(`${config.api}/stripe/session?ref=${ref}`, {
      method: 'GET'
    });

    const session = await response.json();

    if (session?.err === 'subscription-exists') {
      message.success('You already have a subscription to this event');
      setModalVisible(false);
      return;
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  let products = event.products
    .map((product) => product.product)
    .concat(event.account.products);

  let hasMultiple = products.length;

  const preBuy = ({ product }) => {
    setProduct(product);
    setModalVisible(false);
    setEmailModalVisible(true);
  };

  const handleClickBuy = async () => {
    window.mixpanel.track('Buy Button Clicked');
    if (hasMultiple) {
      setModalVisible(true);
    } else {
      buy();
    }
  };

  return (
    <React.Fragment>
      <Button
        type="primary"
        size="large"
        icon={<TagOutlined />}
        onClick={handleClickBuy}
      >
        Buy Ticket {!hasMultiple ? `(${event.price})` : null}
      </Button>
      <Modal
        title="Buy"
        visible={emailModalVisible}
        footer={null}
        onCancel={() => setEmailModalVisible(false)}
      >
        <Form
          name="basic"
          onFinish={(values) => buy({ product, values })}
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large">
            Buy
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Buy"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {products.map((product) => (
          <PurchaseOption>
            {true && (
              <Button
                onClick={() => (user ? buy({ product }) : preBuy({ product }))}
                type="primary"
                size="large"
                style={{ float: 'right' }}
              >
                Buy
              </Button>
            )}
            <h1>{product.name}</h1>
            <div>{product.descriptioni}</div>
            <div>{product.price}</div>
            {product.account_access && (
              <div>
                <StarOutlined /> Full Account Access
              </div>
            )}
          </PurchaseOption>
        ))}
      </Modal>
    </React.Fragment>
  );
}
