const { sequelizeConvert } = require("feathers-hooks-common");
const { authenticate } = require("@feathersjs/authentication").hooks;
const { compareTwoStrings } = require("string-similarity");

const { makeCitations } = require("../graphs/utilities/citations");
const { limitToAdminOrOwningUser } = require("../hooks");

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
const detectDuplicates = (workABibliography, workBBibliography, threshold) => {
  const score = compareTwoStrings(workABibliography, workBBibliography);
  return score >= threshold;
};

// Hook to reject a work if it appears to be a duplicate of an existing work in
// the database; by setting context.result here, we short-circuit the CREATE
// call to the database and simply send back the existing work as it is
const rejectDuplicateWork = async context => {
  const { app, data } = context;
  const graphsService = app.service("graphs");
  const worksService = app.service("works");
  const proposedWorkBibliography = makeCitations(data).bibliography;

  // Use FlexSearch index to detect duplicates instead of querying the database
  // for all works (the latter gets quite slow after many works are added)
  const results = await graphsService.find({
    query: { searchQuery: proposedWorkBibliography }
  });
  const relataConfig = app.get("relata");
  const threshold = relataConfig.duplicateWorkThreshold || 0.67;
  for (existingWork of results) {
    if (
      detectDuplicates(
        proposedWorkBibliography,
        existingWork.bibliography,
        threshold
      )
    ) {
      const canonicalWork = await worksService.get(existingWork.id);
      context.result = canonicalWork;
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
    create: [
      authenticate("jwt"),
      limitToAdminOrOwningUser,
      rejectDuplicateWork
    ],
    update: [
      authenticate("jwt"),
      limitToAdminOrOwningUser,
      sequelizeConvert(convert)
    ],
    patch: [
      authenticate("jwt"),
      limitToAdminOrOwningUser,
      sequelizeConvert(convert)
    ],
    remove: [
      authenticate("jwt"),
      limitToAdminOrOwningUser,
      sequelizeConvert(convert)
    ]
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
