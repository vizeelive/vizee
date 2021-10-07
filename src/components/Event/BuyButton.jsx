import config from 'config';
import logger from 'logger';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'zipson';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import Cookies from 'js-cookie';

import CurrencyInput from 'components/CurrencyInput';
import { Modal, message, Form, Input } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import Button from 'components/ui/Button';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PurchaseOption = styled.div`
  border: 1px solid #333333;
  margin-bottom: 20px;
  padding: 20px;
`;

export default function BuyButton(props) {
  const isTip = props?.isTip || false;
  const { account, event, user } = props;
  const [form] = Form.useForm();
  const [fastCheckout, setFastCheckout] = useState(props?.product);
  const [product, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const buy = async (params = {}) => {
    const { product, values } = params;

    let amount = values?.amount?.replace(/[^\d.]/g, '');
    let event_id = event?.id;
    let account_id = account?.id;
    let product_id = product?.id;
    let email = user?.email || values?.email;
    let affiliate = Cookies.get('affiliate_user_id');

    let data = {
      ...(!event_id && !product_id ? { account_id } : null),
      ...(email ? { email } : null),
      ...(affiliate ? { affiliate } : null),
      ...(product_id ? { product_id } : null),
      ...(event_id ? { event_id } : null),
      ...(isTip ? { isTip: true } : null),
      ...(amount ? { amount } : null)
    };

    let ref = encodeURIComponent(stringify(data));
    logger.info('client_reference_id', data, ref.length);

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

  let hasMultiple = (!isTip && products?.length) || false;
  let onlySubscriptions = products.every((product) => product.recurring);

  let label;
  if (account) {
    label = onlySubscriptions ? 'Subscribe' : 'Get Access';
  } else if (event.account_only) {
    label = 'Subscribe';
    ``;
  } else {
    label = `Buy Ticket ${!hasMultiple ? `(${event.price})` : ''}`;
  }

  if (isTip) {
    label = 'Support';
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
    } else if (isTip) {
      setTipModalVisible(true);
    } else {
      buy();
    }
  };

  let buyFunction;
  if (fastCheckout) {
    buyFunction = user ? buy : preBuy;
  } else {
    buyFunction = handleClickBuy;
  }

  return (
    <React.Fragment>
      <Button
        data-test-id="button-buy"
        type="button"
        className="xs:w-full md:w-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm lg:text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
        onClick={() => buyFunction({ product: fastCheckout })}
      >
        {/* Heroicon name: tag */}
        {!isTip && (
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
        )}
        {/* Heroicon name: currency-dollar */}
        {isTip && (
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
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {label}
      </Button>
      {/* <!-- Tip Modal --> */}
      <Modal
        title="Support"
        visible={tipModalVisible}
        footer={null}
        onCancel={() => setTipModalVisible(false)}
      >
        <Form
          name="basic"
          onFinish={(values) => buy({ product, values })}
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Required' }]}
          >
            <CurrencyInput
              className="ant-input"
              style={{ maxWidth: '10rem' }}
            />
          </Form.Item>
          <Button
            data-test-id="button-tip"
            htmlType="submit"
            type="primary"
            size="large"
          >
            Support
          </Button>
        </Form>
      </Modal>
      {/* <!-- Email Modal --> */}
      <Modal
        title={label}
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
      {/* <!-- Buy Modal --> */}
      <Modal
        title={label}
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
          <PurchaseOption key={product.id}>
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
            <div>
              {product.price}{' '}
              {product.recurring ? `every ${product.access_length} days` : null}
            </div>
            <br />
            <div>{product.description}</div>
            <br />
            {product.account_access && (
              <div>
                <StarOutlined /> Full Channel Access
              </div>
            )}
            {product.download_access && (
              <div>
                <StarOutlined /> Download Access
              </div>
            )}
          </PurchaseOption>
        ))}
      </Modal>
    </React.Fragment>
  );
}

BuyButton.propTypes = {
  isTip: PropTypes.bool,
  user: PropTypes.object,
  event: PropTypes.object
};
