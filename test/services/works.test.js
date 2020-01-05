const assert = require("assert");
const app = require("../../src/app");

describe("'works' service", () => {
  it("registered the service", () => {
    const service = app.service("works");

    assert.ok(service, "Registered the service");
  });
});
