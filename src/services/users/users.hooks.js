const { authenticate } = require("@feathersjs/authentication").hooks;
const { setNow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [setNow("created_at", "updated_at")],
    update: [setNow("updated_at")],
    patch: [authenticate("jwt"), setNow("updated_at")],
    remove: [authenticate("jwt")]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
