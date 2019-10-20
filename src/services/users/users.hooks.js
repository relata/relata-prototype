const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  alterItems,
  discard,
  keep,
  required,
  setNow
} = require("feathers-hooks-common");

const {
  hashPassword,
  protect
} = require("@feathersjs/authentication-local").hooks;

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [
      required("name", "email", "password"),
      alterItems(user => {
        user.role = "user";
      }),
      keep("name", "email", "password", "role"),
      hashPassword("password"),
      setNow("created_at", "updated_at")
    ],
    update: [
      required("name", "email", "password"),
      discard("role"),
      hashPassword("password"),
      authenticate("jwt"),
      setNow("updated_at")
    ],
    patch: [
      discard("role"),
      hashPassword("password"),
      authenticate("jwt"),
      setNow("updated_at")
    ],
    remove: [authenticate("jwt")]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password")
    ],
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
