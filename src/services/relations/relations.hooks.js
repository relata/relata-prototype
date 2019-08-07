const { keep, required, setNow, validate } = require("feathers-hooks-common");

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

// Add shorthand citation attributes for related works
const addCitations = async context => {
  const { result } = context;
  const relationFromName = result.relation_from.author[0].family;
  const relationFromYear = result.relation_from.issued["date-parts"][0][0];
  const relationToName = result.relation_to.author[0].family;
  const relationToYear = result.relation_to.issued["date-parts"][0][0];

  result.citation_from = `${relationFromName} ${relationFromYear}`;
  result.citation_to = `${relationToName} ${relationToYear}`;
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
      validate(validateRelation),
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
    get: [addCitations],
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
