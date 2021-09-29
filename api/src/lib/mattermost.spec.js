require('dotenv').config();
const mattermost = require('./mattermost');

const fetch = require('node-fetch');
jest.mock('node-fetch');

describe.skip('mattermost', () => {
  describe('createChannel', () => {
    it('should create a channel', async () => {
      fetch.mockResolvedValue({ json: () => Promise.resolve({}) });
      let res = await mattermost.createChannel({ username: 'yoyo' });
      console.log(fetch.mock.calls);
    });
  });
});
