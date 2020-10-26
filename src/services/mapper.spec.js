import Mapper from './mapper';

describe('Mapper', () => {
  it('should map nested data to objects', () => {
    let data = {
      __typename: 'events',
      id: '6a6ec6d1-93cc-4b71-9e0e-845253ab0dbd',
      name: 'sdfdsf',
      start: '2020-10-22T21:19:47.865+00:00',
      photo:
        'https://dam-media.s3.amazonaws.com/dd/e2b1b7e7924e77a73f27b198b5dfc1/1.jpg',
      preview: null,
      type: 'live',
      price: '$1.00',
      end: '2020-10-22T21:19:47.865+00:00',
      location: null,
      location_pos: null,
      published: true,
      account: {
        __typename: 'accounts',
        id: 'c5fcd960-19eb-4e4f-88d8-d75224e89e83',
        name: 'Trey Anastasio Band',
        username: 'treyanastasio',
        photo:
          'https://dam-media.s3.amazonaws.com/d8/f20511775243f5b07698c05276ced9/39_Original.png',
        users: [
          {
            __typename: 'accounts_users',
            user: {
              __typename: 'users',
              id: 'auth0|5f8838b47119bc007640b4af'
            }
          }
        ]
      },
      category: {
        __typename: 'categories',
        id: '06a15dcd-03cb-4dcd-b052-b9d8a84212cc',
        name: 'Music'
      },
      transactions: [],
      favorites: [
        {
          __typename: 'favorites',
          id: 'c6e23e10-9b5a-4671-851c-62d5f531584e'
        }
      ]
    };
    let res = Mapper(data);
    expect(res.type).toBe('live');
    expect(res.isBroadcast()).toBe(true);
    expect(res.account.canSell()).toBe(false);
  });
});
