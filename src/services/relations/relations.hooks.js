const { BadRequest } = require("@feathersjs/errors");
const {
  discard,
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

  // Create work(s) if they do not already exist; if they do, grab existing IDs
  for (let attribute of ["relation_from", "relation_to"]) {
    const queryResults = await worksService.find({
      query: {
        $select: ["_id"],
        $limit: 1,
        $or: [
          // eslint-disable
          {
            title: data[attribute].title.trim()
          },
          {
            "author.family": data[attribute].author[0].family.trim()
          }
          // eslint-enable
        ]
      }
    });
    console.log(queryResults);
    if (queryResults.data.length == 0) {
      console.log("No existing works found");
      let workCreated = await worksService.create(data[attribute]);
      context.data[attribute] = workCreated._id;
    } else {
      const existingWork = queryResults.data[0];
      context.data[attribute] = existingWork._id;
    }
  }

  return context;
};

// Disallow duplicate relations (i.e., don't create a relation that has the
// exact same relation_type, relation_from, and relation_to as one already
// existing; someday, this can be handled more robustly with SQL constraints)
const disallowDuplicateRelation = async context => {
  const { data, service } = context;
  const queryResults = await service.find({
    query: {
      relation_type: data.relation_type,
      relation_from: data.relation_from,
      relation_to: data.relation_to
    }
  });
  if (queryResults.data.length > 0) {
    throw new BadRequest("That relation already exists");
  } else {
    return context;
  }
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
      disallowDuplicateRelation,
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
      disallowDuplicateRelation,
      keep("relation_type", "annotation", "relation_from", "relation_to"),
      setNow("updated_at")
    ],
    patch: [
      validate(validateRelation),
      disallowDuplicateRelation,
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
