const { disallow } = require("feathers-hooks-common");

// Get Relata app configuration (relation types, colors, etc.)
const getConfig = context => {
  const { app } = context;
  const relataConfig = app.get("relata");
  context.result = relataConfig;
};

module.exports = {
  before: {
    all: [],
    find: [getConfig],
    get: [disallow],
    create: [disallow],
    update: [disallow],
    patch: [disallow],
    remove: [disallow]
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
