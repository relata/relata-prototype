// Initializes the `works` service on path `/works`
const { Works } = require("./works.class");
const createModel = require("../../models/works.model");
const hooks = require("./works.hooks");

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
};
