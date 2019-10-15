const { disallow } = require("feathers-hooks-common");

const getWork = async context => {
  const { app, id, result } = context;
  const worksService = app.service("works");
  const work = await worksService.get(id);
  context.result = { work: work };
  return context;
};

const generateGraph = async context => {
  const { app, result } = context;
  const { work } = result;

  // Look up relations to and from this work
  const relations = await app.service("relations").find({
    query: {
      $limit: 1000,
      $select: ["relation_type", "annotation", "relation_from", "relation_to"],
      $or: [{ relation_to: work._id }, { relation_from: work._id }]
    }
  });

  const relationsFrom = [];
  const relationsTo = [];
  const digraphLines = [];

  // Set default digraph styling
  const nodeDefaults = `node [
    shape = "rect",
    style = "filled, rounded",
    fillcolor = "#f6f6f6",
    color = "#dddddd",
    fontname = "helvetica",
    fontsize = 10
  ];
  edge [fontname = "helvetica", fontsize = 8]`;
  digraphLines.push(`digraph {
    tooltip = "Click on a work to view relations to and from that work";
    rankdir = "LR";
    ${nodeDefaults}`);

  digraphLines.push(
    `;\n"${work.shortCitation}" [
      id = "node-${work._id}",
      style = "square",
      fontname = "helvetica-bold",
      fillcolor="#ffffff",
      color="#000000",
      fontsize = 11
    ]`
  );

  // Iterate over relations and works
  const worksService = app.service("works");
  for (let relation of relations.data) {
    let color =
      app.get("relata").colors[relation.relation_type] ||
      app.get("relata").colors["*"];
    let relationFrom = await worksService.get(relation.relation_from);
    let relationTo = await worksService.get(relation.relation_to);
    if (relation.relation_from == work._id) {
      relationsTo.push({
        relation_type: relation.relation_type,
        work: relationTo,
        annotation: relation.annotation
      });
    } else if (relation.relation_to == work._id) {
      relationsFrom.push({
        relation_type: relation.relation_type,
        work: relationFrom,
        annotation: relation.annotation
      });
    }
    digraphLines.push(
      `;\n"${relationFrom.shortCitation}" [id = "node-${relationFrom._id}"]`
    );
    digraphLines.push(
      `;\n"${relationTo.shortCitation}" [id = "node-${relationTo._id}"]`
    );
    digraphLines.push(
      `;\n"${relationFrom.shortCitation}" -> "${relationTo.shortCitation}" [label = "${relation.relation_type}", color = "${color}"]`
    );
  }
  digraphLines.push("\n}");

  // Add relations to result
  result.relationsFrom = relationsFrom;
  result.relationsTo = relationsTo;

  // Filter digraph lines for repeats
  result.digraph = digraphLines
    .filter((element, position, array) => {
      return array.indexOf(element) == position;
    })
    .join("");

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
    get: [getWork, generateGraph],
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
