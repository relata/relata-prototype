const { sequelizeConvert } = require("feathers-hooks-common");
const { authenticate } = require("@feathersjs/authentication").hooks;
const { compareTwoStrings } = require("string-similarity");

const { makeCitations } = require("../graphs/utilities/citations");

const convert = {
  data: "json"
};

// Add bibliographic entry to FlexSearch index on creation
const addWorkToIndex = async context => {
  const { result, service } = context;
  const { bibliography } = makeCitations(result);
  service.index.add(result.id, bibliography);
  return context;
};

// Update existing entry in FlexSearch index on update
const updateWorkInIndex = async context => {
  const { result, service } = context;
  const { bibliography } = makeCitations(result);
  service.index.update(result.id, bibliography);
  return context;
};

// Remove existing entry from FlexSearch index on update
const removeWorkFromIndex = async context => {
  const { result, service } = context;
  service.index.remove(result.id);
  return context;
};

// Very rough duplicate-detection function that performs fuzzy comparison of
// one bibliographic citation to another. Not very sophisticated; just a guard
// against simple cases
const detectDuplicates = (workA, workB, threshold) => {
  const workACitation = makeCitations({ data: workA }).bibliography;
  const workBCitation = makeCitations({ data: workB }).bibliography;
  const score = compareTwoStrings(workACitation, workBCitation);
  return score >= threshold;
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
  const relataConfig = app.get("relata");
  const threshold = relataConfig.duplicateWorkThreshold || 0.67;
  for (existingWork of results) {
    if (detectDuplicates(data.data, existingWork.data, threshold)) {
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
    create: [authenticate("jwt"), rejectDuplicateWork],
    update: [authenticate("jwt"), sequelizeConvert(convert)],
    patch: [authenticate("jwt"), sequelizeConvert(convert)],
    remove: [authenticate("jwt"), sequelizeConvert(convert)]
  },

  after: {
    all: [],
    find: [sequelizeConvert(convert)],
    get: [sequelizeConvert(convert)],
    create: [addWorkToIndex],
    update: [sequelizeConvert(convert), updateWorkInIndex],
    patch: [sequelizeConvert(convert), updateWorkInIndex],
    remove: [sequelizeConvert(convert), removeWorkFromIndex]
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
