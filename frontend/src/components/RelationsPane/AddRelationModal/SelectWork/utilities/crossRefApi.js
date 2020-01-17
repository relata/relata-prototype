const queryCrossRefApi = async query => {
  // Construct URL
  const url = new URL("https://api.crossref.org/works");
  url.searchParams.set("rows", 25);
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

export { queryCrossRefApi };
