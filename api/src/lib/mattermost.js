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

async function createChannel({ name, display_name }) {
  return await fetch(`${process.env.MATTERMOST_URL}/api/v4/channels`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`
    },
    body: JSON.stringify({
      team_id: 'naw3jjp6jifofjrm59mis7waby',
      name,
      display_name: display_name || name,
      type: 'O'
    })
  }).then((res) => res.json());
}

async function updateChannel(params) {
  let { id, name, display_name } = params;
  return await fetch(`${process.env.MATTERMOST_URL}/api/v4/channels/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`
    },
    body: JSON.stringify({
      id,
      name,
      display_name,
      type: 'O'
    })
  }).then((res) => res.json());
}

module.exports = { createUser, login, createChannel, updateChannel };
