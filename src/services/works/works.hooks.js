const { sequelizeConvert } = require("feathers-hooks-common");

const convert = {
  data: "json"
};

module.exports = {
  before: {
    all: [sequelizeConvert(convert)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [sequelizeConvert(convert)],
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
