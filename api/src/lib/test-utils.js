const cloneDeep = require('clone-deep');

function fixture(fixture) {
  return cloneDeep(require('../fixtures/' + fixture));
}

module.exports = { fixture };
