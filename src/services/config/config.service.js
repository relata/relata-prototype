// Initializes the `config` service on path `/config`
const { Config } = require("./config.class");
const hooks = require("./config.hooks");

module.exports = function(app) {
  const options = {
    paginate: app.get("paginate")
  };

  // Initialize our service with any options it requires
  app.use("/config", new Config(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("config");

  service.hooks(hooks);
};
