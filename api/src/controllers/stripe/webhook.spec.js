require('dotenv').config();
const webhook = require('./webhook');

describe('webhook', () => {
  it('should do things', async () => {
    let req = jest.fn();
    let res = jest.fn();
    let event = {
      id: 'evt_1HygrjFN46jAxE7QAOFlicQJ',
      object: 'event',
      api_version: '2020-03-02',
      created: 1608051551,
      data: {
        object: {
          id:
            'cs_test_a14CETo4Gk7UxakIyEBjwy1PfjyAfahnrM6kez0k9r9NryPfAXvyeaKNdo',
          object: 'checkout.session',
          allow_promotion_codes: null,
          amount_subtotal: 500,
          amount_total: 500,
          billing_address_collection: null,
          cancel_url:
            'http://localhost:3000/mau5trapTV/40369ee2-4321-4b58-8c98-8c7b868fb556/cancel',
          client_reference_id:
            '{¨event_id¨¨40369ee2-4321-4b58-8c98-8c7b868fb556¨¨product_id¨¨2e85e492-3e4e-4697-b3f0-964e7fdeb516¨¨email¨¨jeff@viz.ee¨}',
          currency: 'usd',
          customer: 'cus_IZXztWx64ewLQd',
          customer_email: null,
          livemode: false,
          locale: null,
          metadata: {},
          mode: 'subscription',
          payment_intent: null,
          payment_method_types: ['card'],
          payment_status: 'paid',
          setup_intent: null,
          shipping: null,
          shipping_address_collection: null,
          submit_type: null,
          subscription: 'sub_IZqYCnrflhThza',
          success_url:
            'http://localhost:3000/mau5trapTV/40369ee2-4321-4b58-8c98-8c7b868fb556/success',
          total_details: { amount_discount: 0, amount_tax: 0 }
        }
      },
      livemode: false,
      pending_webhooks: 3,
      request: { id: 'req_xMjxspjwyiBQ3I', idempotency_key: null },
      type: 'checkout.session.completed'
    };
    let result = await webhook({ req, res, event });
    console.log({ result });
  });
});
