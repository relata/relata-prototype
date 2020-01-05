const { disallow } = require("feathers-hooks-common");

const { makeCitations } = require("./utilities/citations");
const { makeDigraph } = require("./utilities/digraph");

// Get a work by its ID
const getWork = async context => {
  const { app, id } = context;
  const work = await app.service("works").get(id);
  return work;
};

// Get the total count of a work's further relations by its ID
const getFurtherRelationsCount = async (app, workId, excludeWorkId) => {
  const queryResults = await app.service("relations").find({
    $limit: 0,
    query: {
      $or: [{ workFromId: workId }, { workToId: workId }],
      workToId: { $ne: excludeWorkId },
      workFromId: { $ne: excludeWorkId }
    }
  });
  return queryResults.total;
};

// Obtain relations to/from this work
const getRelations = async (app, work) => {
  const sequelize = app.get("sequelizeClient");
  sequelize.raw = true;

  // Get all relations to and from this work
  const relations = (await app.service("relations").find({
    query: {
      $or: [{ workFromId: work.id }, { workToId: work.id }],
      expand: true
    },
    paginate: false
  })).map(relation => {
    const relationColor =
      app.get("relata").colors[relation.type] || app.get("relata").colors["*"];
    return {
      id: relation.id,
      user: relation.user.githubId,
      type: relation.type,
      color: relationColor || null,
      annotation: relation.annotation,
      annotationAuthor: relation.annotationAuthor,
      workFrom: {
        id: relation.workFrom.id,
        ...makeCitations(relation.workFrom)
      },
      workTo: { id: relation.workTo.id, ...makeCitations(relation.workTo) }
    };
  });

  // Get further relations counts for related works (ideally, we might someday
  // fetch this more directly through a single query, not a loop)
  for (const relation of relations) {
    for (const relatedWork of [relation.workFrom, relation.workTo]) {
      if (relatedWork.id === work.id) {
        continue;
      }
      relatedWork.furtherRelationsCount = await getFurtherRelationsCount(
        app,
        relatedWork.id,
        work.id
      );
    }
  }

  const relationsFrom = relations
    .filter(relation => relation.workFrom.id === work.id)
    .map(relation => {
      delete relation.workFrom;
      return relation;
    });
  const relationsTo = relations
    .filter(relation => relation.workTo.id === work.id)
    .map(relation => {
      delete relation.workTo;
      return relation;
    });
  return { relationsFrom, relationsTo };
};

// Build graph object representing a single work and its relations
const makeGraph = async context => {
  const work = await getWork(context);
  const citations = makeCitations(work);
  const { relationsFrom, relationsTo } = await getRelations(context.app, work);
  const graph = {
    id: work.id,
    ...citations,
    relationsFrom,
    relationsTo,
    relationsCount: relationsFrom.length + relationsTo.length
  };
  graph.digraph = await makeDigraph(graph);

  context.result = graph;
  return context;
};

module.exports = {
  before: {
    all: [],
    find: [disallow],
    get: [],
    create: [disallow],
    update: [disallow],
    patch: [disallow],
    remove: [disallow]
  },

  after: {
    all: [],
    find: [],
    get: [makeGraph],
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
