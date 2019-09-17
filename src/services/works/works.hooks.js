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
