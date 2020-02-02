// Initializes the `works` service on path `/works`
const { Works } = require("./works.class");
const createModel = require("../../models/works.model");
const hooks = require("./works.hooks");

const FlexSearch = require("flexsearch");

const { makeCitations } = require("../graphs/utilities/citations");

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get("paginate");

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use("/works", new Works(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("works");

  service.hooks(hooks);

  // Initialize a FlexSearch index on this service and add all current works
  service.index = new FlexSearch("speed", {
    tokenize: "forward",
    encode: "advanced"
  }).addMatcher({
    "[øØ]": "o"
  });
  service
    .find({
      $limit: 30000,
      paginate: {
        // Set an extreme upper limit to avoid killing the app
        max: 30000
      },
      query: {}
    })
    .then(works => {
      works.map(work => {
        const { bibliography } = makeCitations(work);
        service.index.add(work.id, bibliography);
      });
    });
};
