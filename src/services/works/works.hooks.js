const { sequelizeConvert } = require("feathers-hooks-common");

const convert = {
  data: "json"
};

// Despite documentation, an error crops up when adding sequelizeConvert hook
// to create action; seems to work fine when leaving that action out
module.exports = {
  before: {
    all: [],
    find: [sequelizeConvert(convert)],
    get: [sequelizeConvert(convert)],
    create: [],
    update: [sequelizeConvert(convert)],
    patch: [sequelizeConvert(convert)],
    remove: [sequelizeConvert(convert)]
  },

  after: {
    all: [],
    find: [sequelizeConvert(convert)],
    get: [sequelizeConvert(convert)],
    create: [],
    update: [sequelizeConvert(convert)],
    patch: [sequelizeConvert(convert)],
    remove: [sequelizeConvert(convert)]
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
