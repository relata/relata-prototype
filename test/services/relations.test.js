const assert = require("assert");
const app = require("../../src/app");

describe("'relations' service", () => {
  it("registered the service", () => {
    const service = app.service("relations");

    assert.ok(service, "Registered the service");
  });
});
