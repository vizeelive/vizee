import config from 'config';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'zipson';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import Cookies from 'js-cookie';

import { Button, Modal, message, Form, Input } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PurchaseOption = styled.div`
  border: 1px solid #333333;
  margin-bottom: 20px;
  padding: 20px;
`;

export default function BuyButton(props) {
  const { account, event, user } = props;
  const [form] = Form.useForm();
  const [product, setProduct] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const buy = async (params = {}) => {
    const { product, values } = params;

    let ref = encodeURIComponent(
      stringify({
        user_id: user?.id,
        event_id: event?.id,
        product_id: product?.id,
        email: user?.email || values?.email,
        affiliate: Cookies.get('affiliate_user_id')
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

  let products;

  if (account) {
    products = account.products;
  } else {
    products = event.products
      .map((product) => product.product)
      .concat(event.account.products);
  }

  let hasMultiple = products?.length || false;
  let onlySubscriptions = products.every((product) => product.recurring);

  let label;
  if (account) {
    label = onlySubscriptions ? 'Subscribe' : 'Get Access';
  } else {
    label = `Buy Ticket ${!hasMultiple ? `(${event.price})` : ''}`;
  }

  const preBuy = (params) => {
    const { product } = params;
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
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm lg:text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
        onClick={handleClickBuy}
      >
        {/* Heroicon name: tag */}
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        {label}
      </button>
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
        {!account && !event.account_only && !event.products.length && (
          <PurchaseOption>
            {true && (
              <Button
                onClick={() =>
                  user ? buy({ product: null }) : preBuy({ product: null })
                }
                type="primary"
                size="large"
                style={{ float: 'right' }}
              >
                Buy
              </Button>
            )}
            <h1>Admission</h1>
            <div>{event.price}</div>
          </PurchaseOption>
        )}
        {products.map((product) => (
          <PurchaseOption>
            {true && (
              <Button
                onClick={() => (user ? buy({ product }) : preBuy({ product }))}
                type="primary"
                size="large"
                style={{ float: 'right' }}
              >
                {product.recurring ? 'Subscribe' : 'Buy'}
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

BuyButton.propTypes = {
  user: PropTypes.object,
  event: PropTypes.object
};
