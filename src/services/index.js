const users = require("./users/users.service.js");
const relations = require("./relations/relations.service.js");
const works = require("./works/works.service.js");
const graphs = require("./graphs/graphs.service.js");
const contributions = require("./contributions/contributions.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(relations);
  app.configure(works);
  app.configure(graphs);
  app.configure(contributions);
};
