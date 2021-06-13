const fetch = require('node-fetch');

async function createUser({ email, username }) {
  return await fetch(`${process.env.MATTERMOST_URL}/api/v4/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`
    },
    body: JSON.stringify({
      email,
      username,
      password: process.env.MATTERMOST_PASS
    })
  }).then((res) => res.json());
}

async function login({ email }) {
  return await fetch(`${process.env.MATTERMOST_URL}/api/v4/users/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`
    },
    body: JSON.stringify({
      login_id: email,
      password: process.env.MATTERMOST_PASS
    })
  }).then(async (res) => {
    let token = res.headers.get('token');
    let { id } = await res.json();
    return { MMUSERID: id, MMAUTHTOKEN: token };
  });
}

module.exports = { createUser, login };
