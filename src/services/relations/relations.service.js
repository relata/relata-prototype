// Initializes the `relations` service on path `/relations`
const { Relations } = require("./relations.class");
const createModel = require("../../models/relations.model");
const hooks = require("./relations.hooks");

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get("paginate");

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use("/relations", new Relations(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("relations");

  service.hooks(hooks);
};
