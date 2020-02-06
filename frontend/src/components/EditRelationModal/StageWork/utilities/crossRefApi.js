// Filter out any CrossRef works outside a range of standard bibliographic
// types; this cuts down on some potentially irrelevant results and is much
// more performant than the CrossRef API's (rather slow) filter param
const filterCrossRefWorkByType = (work, index) => {
  const validTypes = [
    "article-journal",
    "book",
    "chapter",
    "manuscript",
    "paper-conference",
    "report"
  ];
  return validTypes.includes(work.type);
};

// Transform invalid CSL JSON types from CrossRef API to make them compliant;
// because CrossRef API won't serve requests on works endpoint when we specify
// a content type of CSL JSON, we have to fix work types ourselves as
// described here: https://github.com/CrossRef/rest-api-doc/issues/222
const fixCrossRefWork = work => {
  const typeMappings = {
    "journal-article": "article-journal",
    "book-chapter": "chapter",
    "posted-content": "manuscript",
    "proceedings-article": "paper-conference"
  };
  work.type = typeMappings[work.type] || work.type;

  // If there happens to be an id field, remove it
  delete work.id;

  return work;
};

const queryCrossRefApi = async query => {
  // Construct URL
  const url = new URL("https://api.crossref.org/works");
  url.searchParams.set("rows", 20);
  url.searchParams.set("query.bibliographic", query);

  // The CrossRef API documentation advises to specify this content type in
  // our headers, but throws a 406 response if it's used; leaving it commented
  // out for now
  // const headers = {
  //   Accept: "application/vnd.citationstyles.csl+json"
  // };

  const response = await fetch(url.href);
  const responseJson = await response.json();
  const items = responseJson.message.items;

  return items;
};

export { filterCrossRefWorkByType, fixCrossRefWork, queryCrossRefApi };
