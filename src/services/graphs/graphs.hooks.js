const { disallow } = require("feathers-hooks-common");

const getWork = async context => {
  const { app, id, result } = context;
  const worksService = app.service("works");
  const work = await worksService.get(id);
  context.result = work;
  return context;
};

const appendDigraph = async context => {
  const { app, result } = context;

  // Look up relations to and from this work
  const relations = await app.service("relations").find({
    query: {
      $limit: 1000,
      $select: ["relation_type", "annotation", "relation_from", "relation_to"],
      $or: [
        // eslint-disable
        {
          relation_to: result._id
        },
        {
          relation_from: result._id
        }
        // eslint-enable
      ]
    }
  });

  const digraphLines = [];

  // Set default digraph styling
  const nodeDefaults = `node [
    shape = "rect",
    style = "filled, rounded",
    fillcolor = "#f6f6f6",
    color = "#dddddd",
    fontname = "Helvetica, Arial",
    fontsize = 10
  ];
  edge [fontname = "Helvetica, Arial", fontsize = 8]`;
  digraphLines.push(`digraph {
    rankdir = "LR";
    ${nodeDefaults}`);

  digraphLines.push(
    `;\n"${result.shortCitation}" [ id = "${result._id}", penwidth = 2 ]`
  );

  // Iterate over relations and works
  const worksService = app.service("works");
  for (let relation of relations.data) {
    let color =
      app.get("relata").colors[relation.relation_type] ||
      app.get("relata").colors["*"];
    let relationFrom = await worksService.get(relation.relation_from);
    let relationTo = await worksService.get(relation.relation_to);
    digraphLines.push(
      `;\n"${relationFrom.shortCitation}" [id = "${relationFrom._id}"]`
    );
    digraphLines.push(
      `;\n"${relationTo.shortCitation}" [id = "${relationTo._id}"]`
    );
    digraphLines.push(
      `;\n"${relationFrom.shortCitation}" -> "${relationTo.shortCitation}" [label = "${relation.relation_type}", color = "${color}"]`
    );
  }
  digraphLines.push("\n}");

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
    get: [getWork, appendDigraph],
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
