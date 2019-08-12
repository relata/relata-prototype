const { Cite } = require("citation-js");

// Add citation attributes to work
const appendCitationsToWork = async work => {
  // Short citation
  const firstAuthorName = work.author[0].family;
  const publicationYear = work.issued["date-parts"][0][0];
  const shortCitation = `${firstAuthorName} ${publicationYear}`;

  // Long citation
  const longCitation = "";
  return {
    ...work,
    shortCitation,
    longCitation
  };
};

const addCitations = async context => {
  const { method, result } = context;
  if (method === "find") {
    // Map all data to include citations
    result.data = await Promise.all(result.data.map(appendCitationsToWork));
  } else {
    // Otherwise just update the single result
    result = await appendCitationsToWork(result);
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
