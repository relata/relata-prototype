const { sequelizeConvert } = require("feathers-hooks-common");
const { compareTwoStrings } = require("string-similarity");

const { makeCitations } = require("../graphs/utilities/citations");

const convert = {
  data: "json"
};

// Very rough duplicate-detection function that performs fuzzy comparison of
// one bibliographic citation to another. Not very sophisticated; just a guard
// against simple cases
const detectDuplicates = (workA, workB) => {
  const workACitation = makeCitations({ data: workA }).bibliography;
  const workBCitation = makeCitations({ data: workB }).bibliography;
  const score = compareTwoStrings(workACitation, workBCitation);
  return score > 0.67;
};

// Hook to reject a work if it appears to be a duplicate of an existing work in
// the database; by setting context.result here, we short-circuit the CREATE
// call to the database and simply send back the existing work as it is
const rejectDuplicateWork = async context => {
  const { app, data } = context;
  const worksService = app.service("works");
  const results = await worksService.find({
    $limit: 30000,
    paginate: {
      // Set an extreme upper limit to avoid killing the app
      max: 30000
    }
  });
  for (existingWork of results) {
    if (detectDuplicates(data, existingWork.data)) {
      context.result = existingWork;
      break;
    }
  }
  return context;
};

// Despite documentation, an error crops up when adding sequelizeConvert hook
// to create action; seems to work fine when leaving that action out
module.exports = {
  before: {
    all: [],
    find: [sequelizeConvert(convert)],
    get: [sequelizeConvert(convert)],
    create: [rejectDuplicateWork],
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
