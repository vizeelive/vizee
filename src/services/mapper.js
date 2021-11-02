import { cloneDeep } from 'lodash';

import accounts from './models/Account';
import events from './models/Event';
import users from './models/User';

const models = {
  accounts,
  events,
  users,
  events_report: events
};

export default function Mapper(data) {
  let output = cloneDeep(data);
  for (let key in data) {
    if (key === '__typename') {
      output = cloneDeep(map(output));
      continue;
    }
    if (Array.isArray(data[key])) {
      for (let i = 0; i < data[key].length; i++) {
        output[key][i] = Mapper(data[key][i]);
      }
    } else if (data[key] !== null && typeof data[key] === 'object') {
      output[key] = Mapper(data[key]);
    }
  }
  return output;
}

function map(data) {
  let output = data;
  let type = data?.__typename;
  if (models?.[type]) {
    output = new models[type](data);
  }
  return output;
}
