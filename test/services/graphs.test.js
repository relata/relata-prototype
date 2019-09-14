const assert = require("assert");
const app = require("../../src/app");

describe("'graphs' service", () => {
  it("registered the service", () => {
    const service = app.service("graphs");

    assert.ok(service, "Registered the service");
  });
});
