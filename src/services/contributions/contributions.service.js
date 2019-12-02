// Initializes the `contributions` service on path `/contributions`
const { Contributions } = require("./contributions.class");
const hooks = require("./contributions.hooks");

module.exports = function(app) {
  const options = {
    paginate: app.get("paginate")
  };

  // Initialize our service with any options it requires
  app.use("/contributions", new Contributions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("contributions");

  service.hooks(hooks);
};
