const { disallow } = require("feathers-hooks-common");

const getWork = async context => {
  const { app, id } = context;
  const worksService = app.service("works");
  const work = await worksService.get(id);
  context.result = { work: work };
  return context;
};

const getFurtherRelationsCount = async (relatedWorkId, currentWorkId, app) => {
  // Get a count of further relations to and from this work
  const relations = await app.service("relations").find({
    query: {
      $limit: 0, // We only want to count relations, not get them
      $or: [{ relation_to: relatedWorkId }, { relation_from: relatedWorkId }],
      // Exclude relations to the current work, since those are in the graph
      relation_to: { $ne: currentWorkId },
      relation_from: { $ne: currentWorkId }
    }
  });
  return relations.total;
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
    tooltip = "Relata";
    rankdir = "LR";
    ${nodeDefaults}`);

  // Count relations from current work
  relationsCount = relations.data.length;
  digraphLines.push(
    `;\n"${work._id}" [
      id = "node-${work._id}",
      label = "${work.shortCitation}",
      tooltip = "${relationsCount} relation(s)",
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

    // Handle relations from the current work
    if (relation.relation_from == work._id) {
      relationTo.furtherRelationsCount = await getFurtherRelationsCount(
        relationTo._id,
        work._id,
        app
      );
      relationsTo.push({
        relation_type: relation.relation_type,
        work: relationTo,
        annotation: relation.annotation
      });
      let furtherRelationsString =
        relationTo.furtherRelationsCount > 0
          ? ' <FONT COLOR="#999999">+' +
            relationTo.furtherRelationsCount +
            "</FONT>"
          : "";
      digraphLines.push(
        `;\n"${relationTo._id}" [id = "node-${relationTo._id}", label = <${relationTo.shortCitation}${furtherRelationsString}>, tooltip = "${relationTo.furtherRelationsCount} further relation(s)" ]`
      );

      // Handle relations to the current work
    } else if (relation.relation_to == work._id) {
      relationFrom.furtherRelationsCount = await getFurtherRelationsCount(
        relationFrom._id,
        work._id,
        app
      );
      relationsFrom.push({
        relation_type: relation.relation_type,
        work: relationFrom,
        annotation: relation.annotation
      });
      let furtherRelationsString =
        relationFrom.furtherRelationsCount > 0
          ? ' <FONT COLOR="#999999">+' +
            relationFrom.furtherRelationsCount +
            "</FONT>"
          : "";
      digraphLines.push(
        `;\n"${relationFrom._id}" [id = "node-${relationFrom._id}", label = <${relationFrom.shortCitation}${furtherRelationsString}>, tooltip = "${relationFrom.furtherRelationsCount} further relation(s)" ]`
      );
    }

    // Add edge
    digraphLines.push(
      `;\n"${relationFrom._id}" -> "${relationTo._id}" [
        label = "${relation.relation_type}",
        tooltip = "${relationFrom.shortCitation} -> ${relationTo.shortCitation}",
        labeltooltip = "${relationFrom.shortCitation} -> ${relationTo.shortCitation}",
        color = "${color}"
      ]`
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
