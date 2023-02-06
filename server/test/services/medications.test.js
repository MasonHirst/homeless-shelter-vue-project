const assert = require('assert');
const app = require('../../src/app');

describe('\'medications\' service', () => {
  it('registered the service', () => {
    const service = app.service('medications');

    assert.ok(service, 'Registered the service');
  });
});
