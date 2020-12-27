const { getUser, generateImageLink } = require('./index');

const MockDate = require('mockdate');
MockDate.set(1434319925275);

describe('getUser', () => {
  it('should decode authorization header', () => {
    let req = {
      headers: {
        authorization:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilo1NlZJUlFmTWl3MG9tMHRBVjV6aiJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6IjliOWYwZmEwLThiOWMtNDM2Yi04N2U2LTZkZjA5MGE3NGM3NiJ9LCJuaWNrbmFtZSI6ImplZmYiLCJuYW1lIjoiamVmZkB2aXouZWUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNjg4YWM5MTc5NmNjZmEzZmM4YmM1NDkyYzExOTNkNWY_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqZS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMC0xMi0yNlQxNTo0OTo0Mi4xNTZaIiwiZW1haWwiOiJqZWZmQHZpei5lZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2F1dGgtc3RhZ2luZy52aXplZS5saXZlLyIsInN1YiI6ImVtYWlsfDVmY2E1MDM1YmUwM2QyNGRjOTc1ODBjYSIsImF1ZCI6InUwM3N0WjczWjJMRUY4b0ZoNjN4TU9LdzFiU1BIZEhnIiwiaWF0IjoxNjA5MDY4OTA2LCJleHAiOjE2MDkxMDQ5MDYsIm5vbmNlIjoiYkdkUU9IUlVibE5mWkVaSFVGaERla2h1TXpGaFIyUk9TR0YrVlZGU2IyTnJWekY2ZFdSQlkxcHpOdz09In0.gRLdR0yri2VILpFDM9j5s4HTAaBITzjnLlSKt74q7XqrCRs3ezV_yiGQGoHV9SGU0AwsoNktms-aTzpMDR9P_hEcmi2i4S64eCgvnbAXjfyvfqzmxd6giJnfMp9-NsdDqXj1in4Lw6xB4X8TjeVzXFwlaf180YTuEeIXnQ-AgWwnxPncbV4_tAPBkjEPu5ErP4qTovK-rvz2UFhJoQZlEsa1tSDDEPy6EbYJnYi1-_JckVoMqYrJNsdYXyu4dRshk7qpRRC94EWpiPJdycfreWmuvqEJjWLs5Ax9IazL8tnFRVRC0EbLm4TGF7wC7f4nfXxCx1DZoF6utPAy30SOLA'
      }
    };
    let user = getUser(req);
    expect(typeof user).toEqual('object');
    expect(user).toHaveProperty('id', '9b9f0fa0-8b9c-436b-87e6-6df090a74c76');
    expect(user).toHaveProperty('isAdmin', false);
  });
  it('should return partial null object when there are no authz headers', () => {
    let req = {
      headers: {}
    };
    let user = getUser(req);
    expect(typeof user).toEqual('object');
    expect(user).toHaveProperty('id', null);
    expect(user).toHaveProperty('isAdmin', false);
  });
});

describe('generateImageLink', () => {
  it('should', () => {
    let params = {
      event: {
        name: 'LIVE'
      },
      account: {
        name: 'Beck',
        photo: 'http://example.com/photo.jpg'
      }
    };
    let res = generateImageLink(params);
    expect(res).toEqual(
      'https://ogi.sh/article?title=Beck&eyebrow=Jun 14, 2015 10:12 PM&subtitle=LIVE&imageUrl=http://example.com/photo.jpg'
    );
  });
});
