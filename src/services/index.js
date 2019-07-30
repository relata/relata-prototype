const users = require("./users/users.service.js");
const relations = require("./relations/relations.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(relations);
};
