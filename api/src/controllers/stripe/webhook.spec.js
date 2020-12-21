require('dotenv').config();
const webhook = require('./webhook');
const { stringify } = require('zipson');

const stripe = require('../../lib/stripe');
const queries = require('../../queries');
const mutations = require('../../mutations');

jest.mock('../../lib/stripe');
jest.mock('../../queries');
jest.mock('../../mutations');

var getUserFixture = require('../../fixtures/queries/getUser.json');
var getCustomerFixture = require('../../fixtures/stripe/customer.json');
var getUserAndProductFixture = require('../../fixtures/queries/getUserAndProduct.json');
var eventCheckoutSessionCompleteFixture = require('../../fixtures/stripe/events/checkout.session.json');
var getPaymentIntentFixture = require('../../fixtures/stripe/payment_intent.json');
var createSubscriptionFixture = require('../../fixtures/stripe/subscription.json');

const MockDate = require('mockdate');
MockDate.set(1434319925275);

describe('webhook', () => {
  /**
   * It's possible to purchase anonymous access to an event with an email
   * address. Non-account-level and non-product event.
   */
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create anonymous event access', async () => {
    queries.getUser.mockReturnValue(getUserFixture);

    let getCustomer = { ...getCustomerFixture, email: 'anon@viz.ee' };
    stripe.getCustomer.mockReturnValue(getCustomer);

    let event = { ...eventCheckoutSessionCompleteFixture };
    event.data.object.client_reference_id = stringify({
      event_id: '40369ee2-4321-4b58-8c98-8c7b868fb556',
      email: 'anon@viz.ee'
    });

    let req = jest.fn();
    let res = jest.fn();
    await webhook({ req, res, event });

    expect(mutations.createAccess.mock.calls[0][0]).toEqual({
      object: {
        expiry: '2061-03-16 00:00:00',
        subscription: false,
        email: 'anon@viz.ee',
        event_id: '40369ee2-4321-4b58-8c98-8c7b868fb556',
        stripe_customer_id: 'cus_IZXztWx64ewLQd',
        updated: '2015-06-14 22:12:05'
      }
    });
  });
  // it('should update anonymous access', () => {});
  // it('should update user access', () => {});
  it('should create anon user-linked permanent event access', async () => {
    stripe.getCustomer.mockReturnValue({
      ...getCustomerFixture,
      email: 'jeff@viz.ee'
    });
    stripe.getPaymentIntent.mockReturnValue(getPaymentIntentFixture);
    stripe.createSubscription.mockReturnValue(createSubscriptionFixture);

    queries.getUser.mockReturnValue({
      ...getUserFixture,
      user: { id: '9b9f0fa0-8b9c-436b-87e6-6df090a74c76', access: [] }
    });

    let event = eventCheckoutSessionCompleteFixture;
    event.data.object.client_reference_id = stringify({
      event_id: '40369ee2-4321-4b58-8c98-8c7b868fb556',
      user_id: '9b9f0fa0-8b9c-436b-87e6-6df090a74c76'
    });

    let req = jest.fn();
    let res = jest.fn();
    await webhook({ req, res, event });

    expect(mutations.createAccess.mock.calls[0][0]).toEqual({
      object: {
        expiry: '2061-03-16 00:00:00',
        subscription: false,
        user_id: '9b9f0fa0-8b9c-436b-87e6-6df090a74c76',
        event_id: '40369ee2-4321-4b58-8c98-8c7b868fb556',
        stripe_customer_id: 'cus_IZXztWx64ewLQd',
        updated: '2015-06-14 22:12:05'
      }
    });
  });
  it('should create anon user-linked account subscription', async () => {
    stripe.getCustomer.mockReturnValue({
      ...getCustomerFixture,
      email: 'jeff@viz.ee'
    });
    stripe.getPaymentIntent.mockReturnValue(getPaymentIntentFixture);
    stripe.createSubscription.mockReturnValue(createSubscriptionFixture);
    queries.getUserAndProduct.mockReturnValue(getUserAndProductFixture);

    let event = eventCheckoutSessionCompleteFixture;
    event.data.object.client_reference_id = stringify({
      event_id: '40369ee2-4321-4b58-8c98-8c7b868fb556',
      product_id: 'd9493005-0693-4250-b7f5-b8997938f8ff',
      email: 'jeff@viz.ee'
    });

    let req = jest.fn();
    let res = jest.fn();
    await webhook({ req, res, event });

    expect(mutations.createAccess.mock.calls[0][0]).toEqual({
      object: {
        expiry: '2015-07-14 22:12:05',
        subscription: true,
        user_id: '9b9f0fa0-8b9c-436b-87e6-6df090a74c76',
        account_id: '76680b81-9ec4-41fd-8714-34960d98ecd4',
        product_id: 'd9493005-0693-4250-b7f5-b8997938f8ff',
        stripe_subscription_id: 'sub_Ibh4SISaInCAwM',
        stripe_customer_id: 'cus_IZXztWx64ewLQd',
        updated: '2015-06-14 22:12:05'
      }
    });
  });
});
