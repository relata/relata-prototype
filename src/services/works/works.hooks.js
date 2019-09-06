const { readFileSync } = require("fs");
const path = require("path");
const Cite = require("citation-js");

// Chicago 16th ed. author-date CSL template, sourced from
// https://github.com/citation-style-language. See https://citationstyles.org
const chicagoStyleTemplate = readFileSync(
  path.resolve(__dirname, "chicago-author-date-16th-edition.csl"),
  "utf-8"
);
Cite.CSL.register.addTemplate(
  "chicago-author-date-16th-edition",
  chicagoStyleTemplate
);

// Add citation attributes to work
const appendCitationsToWork = async work => {
  // Short citation
  const firstAuthorName = work.author[0].family;
  const publicationYear = work.issued["date-parts"][0][0];
  const shortCitation = `${firstAuthorName} ${publicationYear}`;

  // Full HTML citation in Chicago author-date format
  const cite = new Cite({
    ...work,
    id: work._id
  });
  const htmlCitation = cite.format("bibliography", {
    format: "html",
    template: "chicago-author-date-16th-edition",
    lang: "en-US"
  });
  return {
    ...work,
    shortCitation: shortCitation,
    htmlCitation: htmlCitation
  };
};

const addCitations = async context => {
  const { method, result } = context;
  if (method === "find") {
    // Map all data to include citations
    result.data = await Promise.all(result.data.map(appendCitationsToWork));
  } else {
    // Otherwise just update the single result
    context.result = await appendCitationsToWork(result);
  }
  return context;
};

const appendDigraph = async context => {
  const { app, config, result } = context;

  // Look up relations to and from this work
  const relations = await app.service("relations").find({
    query: {
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
  let digraph = `digraph {
    rankdir = "LR";
    ${nodeDefaults}`;

  for (let relation of relations.data) {
    let color = app.get("relata").colors[relation.relation_type || "*"];
    digraph += `;\n"${relation.relation_from}" [id = "${relation.relation_from}"]`;
    digraph += `;\n"${relation.relation_to}" [id = "${relation.relation_to}"]`;
    digraph += `;\n"${relation.relation_from}" -> "${relation.relation_to}" [label = "${relation.relation_type}", color = "${color}"]\n`;
  }
  digraph += "}";
  // Fix this hacky workaround
  result.digraph = digraph.replace(
    RegExp(result._id, "g"),
    result.shortCitation
  );
  console.log(result.digraph);
  return context;
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [addCitations],
    find: [],
    get: [appendDigraph],
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
