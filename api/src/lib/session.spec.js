require('dotenv').config();
const { fixture } = require('./test-utils');
const { pay } = require('./checkout');
const queries = require('../queries');
const session = require('./session');

jest.mock('../queries');
jest.mock('./checkout');

describe('session', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('tipping', () => {
    it('should pass happy path', async () => {
      queries.getCheckoutDataEvent.mockReturnValue(
        fixture('queries/getCheckoutDataEvent')
      );

      let ref =
        '{¨isTip¨»¨amount¨¨$1¨¨event_id¨¨3396ff8e-8fe8-46fd-a890-e56a5ed10c35¨¨affiliate¨¨411c830e-5960-4cbe-8856-09e0d1a32367¨}';
      let res = await session({ ref });
      expect(pay.mock.calls[0][0].action).toEqual('event.tip');
      expect(pay.mock.calls[0][0].isTip).toBe(true);
      expect(pay.mock.calls[0][0].origin).toEqual('https://localhost:3000');
      expect(pay.mock.calls[0][0].account).toBeDefined();
      expect(pay.mock.calls[0][0].event).toBeDefined();
      expect(pay.mock.calls[0][0].amount).toEqual(47);
      expect(pay.mock.calls[0][0].unit_amount).toEqual('100');
      expect(pay.mock.calls[0][0].email).not.toBeDefined();
    });
  });
  describe('purchasing an event', () => {
    it('should pass happy path', async () => {
      queries.getCheckoutDataEvent.mockReturnValue(
        fixture('queries/getCheckoutDataEvent')
      );

      let ref =
        '{¨event_id¨¨3396ff8e-8fe8-46fd-a890-e56a5ed10c35¨¨affiliate¨¨411c830e-5960-4cbe-8856-09e0d1a32367¨}';
      let res = await session({ ref });
      expect(pay.mock.calls[0][0].action).toEqual('event.purchase');
      expect(pay.mock.calls[0][0].isTip).not.toBeDefined();
      expect(pay.mock.calls[0][0].origin).toEqual('https://localhost:3000');
      expect(pay.mock.calls[0][0].account).toBeDefined();
      expect(pay.mock.calls[0][0].event).toBeDefined();
      expect(pay.mock.calls[0][0].amount).toEqual(47);
      expect(pay.mock.calls[0][0].unit_amount).toEqual('100');
      expect(pay.mock.calls[0][0].email).not.toBeDefined();
    });
  });
  describe('purchasing an account subscription', () => {
    it('should pass happy path', async () => {
      queries.getCheckoutDataAccount.mockReturnValue(
        fixture('queries/getCheckoutDataAccount')
      );
      let ref =
        '{¨amount¨¨$1¨¨product_id¨¨3396ff8e-8fe8-46fd-a890-e56a5ed10c35¨¨affiliate¨¨411c830e-5960-4cbe-8856-09e0d1a32367¨}';
      let res = await session({ ref });
      expect(pay.mock.calls[0][0].action).toEqual('account.subscribe');
      expect(pay.mock.calls[0][0].isTip).not.toBeDefined();
      expect(pay.mock.calls[0][0].origin).toEqual('https://Cosmic.vizee.pro');
      expect(pay.mock.calls[0][0].account).toBeDefined();
      expect(pay.mock.calls[0][0].event).not.toBeDefined();
      expect(pay.mock.calls[0][0].amount).toEqual(1511);
      expect(pay.mock.calls[0][0].unit_amount).toEqual('1999');
      expect(pay.mock.calls[0][0].email).not.toBeDefined();
    });
  });
});
