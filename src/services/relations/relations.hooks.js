const { authenticate } = require("@feathersjs/authentication").hooks;

const expandAssociations = context => {
  const { expand, ...query } = context.params.query;

  if (expand) {
    const sequelize = context.app.get("sequelizeClient");
    const UserModel = sequelize.models.users;
    const WorkModel = sequelize.models.works;

    context.params.sequelize = {
      attributes: { exclude: ["userId", "workFromId", "workToId"] },
      include: [
        { model: UserModel },
        { model: WorkModel, as: "workFrom" },
        { model: WorkModel, as: "workTo" }
      ],
      raw: false
    };

    // Update the query to drop include
    context.params.query = query;
  }

  return context;
};

module.exports = {
  before: {
    all: [],
    find: [expandAssociations],
    get: [expandAssociations],
    create: [authenticate("jwt")],
    update: [authenticate("jwt")],
    patch: [authenticate("jwt")],
    remove: [authenticate("jwt")]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
