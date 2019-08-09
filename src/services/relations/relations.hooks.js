const {
  keep,
  required,
  setNow,
  traverse,
  validate
} = require("feathers-hooks-common");

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

// Post related works to works service
const createWorks = async context => {
  const { app, data } = context;
  const worksService = app.service("works");
  const workRelatedFrom = await worksService.create(data.relation_from);
  const workRelatedTo = await worksService.create(data.relation_to);
  context.data.relation_from = workRelatedFrom._id;
  context.data.relation_to = workRelatedTo._id;
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
