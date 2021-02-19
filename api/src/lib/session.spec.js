require('dotenv').config();
const { fixture } = require('./test-utils');
const { pay } = require('./checkout');
const queries = require('../queries');
const session = require('./session');

jest.mock('../queries');
jest.mock('./checkout');

describe('session', () => {
  it('should pass happy path', async () => {
    queries.getCheckoutDataEvent.mockReturnValue(
      fixture('queries/getCheckoutDataEvent')
    );

    let ref =
      '{¨isTip¨»¨amount¨¨$1¨¨event_id¨¨3396ff8e-8fe8-46fd-a890-e56a5ed10c35¨¨affiliate¨¨411c830e-5960-4cbe-8856-09e0d1a32367¨}';
    let res = await session({ ref });
    let arg = pay.mock.calls[0][0];
    delete arg.image;
    // console.log(pay.mock.calls[0][0]);
    expect(arg).toEqual({
      action: 'event.tip',
      ref:
        '{¨isTip¨»¨amount¨¨$1¨¨event_id¨¨3396ff8e-8fe8-46fd-a890-e56a5ed10c35¨¨affiliate¨¨411c830e-5960-4cbe-8856-09e0d1a32367¨}',
      isTip: true,
      origin: 'https://localhost:3000',
      account: {
        __typename: 'accounts',
        id: '9ed4a92d-0a4a-4d31-a661-7ae2fbf33e08',
        name: 'Eli Light',
        photo:
          'https://vizee-media.s3.amazonaws.com/5c/083d07f998476181160749766917ec/Screen-Shot-2020-12-08-at-12.12.26-PM.png',
        username: 'EliLight',
        fee_percent: 20,
        domain: null,
        stripe_id: 'acct_1I7io52ZzvGYyXC5'
      },
      event: {
        __typename: 'events',
        id: '3396ff8e-8fe8-46fd-a890-e56a5ed10c35',
        name: 'free tip',
        price: '$1.00',
        photo: null,
        start: '2021-01-15T14:06:37.776+00:00',
        account: {
          __typename: 'accounts',
          id: '9ed4a92d-0a4a-4d31-a661-7ae2fbf33e08',
          name: 'Eli Light',
          photo:
            'https://vizee-media.s3.amazonaws.com/5c/083d07f998476181160749766917ec/Screen-Shot-2020-12-08-at-12.12.26-PM.png',
          username: 'EliLight',
          fee_percent: 20,
          domain: null,
          stripe_id: 'acct_1I7io52ZzvGYyXC5'
        }
      },
      amount: 47,
      unit_amount: '100',
      email: undefined
    });
  });
});
