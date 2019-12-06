const { disallow } = require("feathers-hooks-common");

const getContributionsByUser = async context => {
  const { app, id } = context;
  const relationsService = app.service("relations");
  const worksService = app.service("works");
  const userContributions = await relationsService.find({
    query: {
      user_id: id
    },
    paginate: false
  });
  const sortedContributions = userContributions.sort((a, b) => {
    if (a.relation_type > b.relation_type) {
      return 1;
    }
    if (a.relation_type < b.relation_type) {
      return -1;
    }
    return 0;
  });
  const promises = sortedContributions.map(async relation => {
    const relationFrom = await worksService.get(relation.relation_from);
    const relationTo = await worksService.get(relation.relation_to);
    return {
      ...relation,
      relation_from: relationFrom,
      relation_to: relationTo
    };
  });
  context.result = await Promise.all(promises);
};

module.exports = {
  before: {
    all: [],
    find: [disallow()],
    get: [],
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [getContributionsByUser],
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
