const { BadRequest } = require("@feathersjs/errors");
const {
  discard,
  keep,
  required,
  setNow,
  traverse,
  validate
} = require("feathers-hooks-common");
const Fuse = require("fuse.js");

// Array against which to validate relation_type field
const validRelationTypes = [
  "absence",
  "criticism",
  "critique",
  "extension",
  "omission",
  "rejoinder"
];
// Simple validator for relations
const validateRelation = (formValues, context) => {
  const { relation_type } = formValues;
  if (relation_type && !validRelationTypes.includes(relation_type)) {
    return {
      relation_type: `relation_type must be one of the following: ${validRelationTypes.join(
        ", "
      )}`
    };
  }
};

// Traverse relation object to trim excess whitespace
const trimmer = function(node) {
  if (typeof node == "string") {
    this.update(node.replace(/\s{2,}/g, " ").trim());
  }
};

// Determine if a work already exists (fuzzy match on title, first author)
let fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 50,
  maxPatternLength: 32,
  minMatchCharLength: 2
  // keys: ["title", "author.family"]
};
const findExistingWork = (work, existingWorks) => {
  const titleSearch = new Fuse(existingWorks, {
    ...fuseOptions,
    keys: ["title"]
  });
  const titleResults = titleSearch.search(work.title);

  const authorSearch = new Fuse(existingWorks, {
    ...fuseOptions,
    keys: ["author.family"]
  });
  const authorResults = authorSearch.search(work.author[0].family);

  if (titleResults.length == 0 && authorResults.length == 0) {
    return null;
  } else {
    for (let result of [...titleResults, ...authorResults]) {
      return result._id;
    }
  }
};

// Post related works to works service
const createWorks = async context => {
  const { app, data } = context;
  const worksService = app.service("works");

  // Create work(s) if they do not already exist; if they do, grab existing IDs
  const existingWorks = await worksService.find();
  for (let attribute of ["relation_from", "relation_to"]) {
    let existingWorkID = findExistingWork(data[attribute], existingWorks.data);

    if (existingWorkID == null) {
      let workCreated = await worksService.create(data[attribute]);
      context.data[attribute] = workCreated._id;
    } else {
      context.data[attribute] = existingWorkID;
    }
  }

  return context;
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      required(
        "relation_type",
        "relation_from",
        "relation_from.type",
        "relation_from.title",
        "relation_from.author",
        "relation_to",
        "relation_to.type",
        "relation_to.title",
        "relation_to.author"
      ),
      traverse(trimmer),
      validate(validateRelation),
      discard("relation_from.id", "relation_to.id"),
      createWorks,
      keep("relation_type", "annotation", "relation_from", "relation_to"),
      setNow("created_at", "updated_at")
    ],
    update: [
      required(
        "relation_type",
        "relation_from",
        "relation_from.type",
        "relation_from.title",
        "relation_from.author",
        "relation_to",
        "relation_to.type",
        "relation_to.title",
        "relation_to.author"
      ),
      validate(validateRelation),
      keep("relation_type", "annotation", "relation_from", "relation_to"),
      setNow("updated_at")
    ],
    patch: [
      validate(validateRelation),
      keep("relation_type", "annotation", "relation_from", "relation_to"),
      setNow("updated_at")
    ],
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
