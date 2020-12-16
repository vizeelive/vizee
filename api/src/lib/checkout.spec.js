require('dotenv').config();
const checkout = require('./checkout');

describe('checkout', () => {
  describe('subscribe', () => {
    it('should create a subscription', async () => {
      let res = await checkout.subscribe({
        ref:
          '{¨event_id¨¨40369ee2-4321-4b58-8c98-8c7b868fb556¨¨product_id¨¨2e85e492-3e4e-4697-b3f0-964e7fdeb516¨¨email¨¨jeff@viz.ee¨}',
        origin: 'http://localhost:3000',
        account: {
          __typename: 'accounts',
          name: 'mau5trapTV',
          photo:
            'https://vizee-media.s3.amazonaws.com/3c/cdbfa651c7485d9b36a74ab99117a0/Screen-Shot-2020-12-03-at-3.04.31-PM.png',
          username: 'mau5trapTV',
          fee_percent: 7,
          domain: null,
          stripe_id: 'acct_1HyOm22UrvU1cNxc'
        },
        event: {
          __typename: 'events',
          id: '40369ee2-4321-4b58-8c98-8c7b868fb556',
          name: 'The Last Catbender',
          price: '$1.00',
          photo: null,
          start: '2020-12-04T18:33:16.388+00:00',
          account: {
            __typename: 'accounts',
            name: 'mau5trapTV',
            photo:
              'https://vizee-media.s3.amazonaws.com/3c/cdbfa651c7485d9b36a74ab99117a0/Screen-Shot-2020-12-03-at-3.04.31-PM.png',
            username: 'mau5trapTV',
            fee_percent: 7,
            domain: null,
            stripe_id: 'acct_1HyOm22UrvU1cNxc'
          }
        },
        product: {
          __typename: 'products',
          id: '2e85e492-3e4e-4697-b3f0-964e7fdeb516',
          name: 'Monthly Subscription',
          price: '$5.00',
          recurring: true,
          account_id: '76680b81-9ec4-41fd-8714-34960d98ecd4',
          access_length: 30,
          events: []
        },
        unit_amount: '500',
        image:
          'https://ogi.sh/article?title=mau5trapTV&eyebrow=Dec 4, 2020 6:33 PM&subtitle=The%20Last%20Catbender&imageUrl=https://vizee-media.s3.amazonaws.com/3c/cdbfa651c7485d9b36a74ab99117a0/Screen-Shot-2020-12-03-at-3.04.31-PM.png',
        email: 'jeff@viz.ee'
      });
      console.log({ res });
    });
  });
});
