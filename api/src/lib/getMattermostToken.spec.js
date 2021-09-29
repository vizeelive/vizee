require('dotenv').config();
const getMattermostToken = require('./getMattermostToken');

const mattermost = require('../lib/mattermost');
// jest.mock('../lib/mattermost');

describe.skip('generateUsername', () => {
  beforeEach(() => {
    // mattermost.createUser.mockReturnValue({});
    // mattermost.login.mockReturnValue('a1b2c3');
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });
  it('should generate a useful username', () => {
    let username = getMattermostToken.generateUsername('Trey Anastasio');
    expect(username).toBe('trey-21111');
  });
});

// describe('getMattermostToken', () => {
//   it('create user, login, and return auth token', async () => {
//     let auth = await getMattermostToken.getMattermostToken({
//       name: 'Jeff Loiselle',
//       email: 'jeff+testy@loiselles.com'
//     });
//     expect(auth.MMUSERID).toBe('a1b2c3');
//     expect(auth.MMAUTHTOKEN).toBe('a1b2c3');
//   });
// });
