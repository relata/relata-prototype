// Initializes the `graphs` service on path `/graphs`
const { Graphs } = require("./graphs.class");
const hooks = require("./graphs.hooks");

module.exports = function(app) {
  const options = {
    paginate: app.get("paginate")
  };

  // Initialize our service with any options it requires
  app.use("/graphs", new Graphs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("graphs");

  service.hooks(hooks);
};
