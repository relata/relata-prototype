const { authenticate } = require("@feathersjs/authentication").hooks;

const { limitToAdminOrThisUser } = require("../hooks");

module.exports = {
  before: {
    all: [authenticate("jwt"), limitToAdminOrThisUser],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
