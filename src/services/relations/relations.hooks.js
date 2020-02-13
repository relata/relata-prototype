const { authenticate } = require("@feathersjs/authentication").hooks;

const { limitToAdminOrOwningUser } = require("../hooks");

const expandAssociations = context => {
  const { expand, ...query } = context.params.query;

  if (expand) {
    const sequelize = context.app.get("sequelizeClient");
    const UserModel = sequelize.models.users;
    const WorkModel = sequelize.models.works;

    const publicUserAttributes = ["id", "displayName"];
    const excludedUserAttributes = Object.keys(UserModel.rawAttributes).filter(
      attribute => !publicUserAttributes.includes(attribute)
    );

    context.params.sequelize = {
      attributes: { exclude: ["userId", "workFromId", "workToId"] },
      include: [
        {
          model: UserModel,
          attributes: {
            exclude: excludedUserAttributes
          }
        },
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
    update: [authenticate("jwt"), limitToAdminOrOwningUser],
    patch: [authenticate("jwt"), limitToAdminOrOwningUser],
    remove: [authenticate("jwt"), limitToAdminOrOwningUser]
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
