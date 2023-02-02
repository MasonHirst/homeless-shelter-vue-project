const assert = require('assert');
const app = require('../../src/app');

describe('\'residents\' service', () => {
  it('registered the service', () => {
    const service = app.service('residents');

    assert.ok(service, 'Registered the service');
  });
});
