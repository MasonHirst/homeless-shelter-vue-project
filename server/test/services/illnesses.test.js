const assert = require('assert');
const app = require('../../src/app');

describe('\'illnesses\' service', () => {
  it('registered the service', () => {
    const service = app.service('illnesses');

    assert.ok(service, 'Registered the service');
  });
});
