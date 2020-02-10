// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const users = sequelizeClient.define(
    "users",
    {
      githubId: { type: Sequelize.STRING },
      googleId: { type: Sequelize.STRING },
      zoteroId: { type: Sequelize.STRING },
      username: { type: Sequelize.STRING },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validation: {
          isEmail: true
        }
      },
      displayName: { type: Sequelize.STRING },
      // isAdmin may only be set manually by database administrator
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
          isIn: [[false]]
        }
      }
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  // eslint-disable-next-line no-unused-vars
  users.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
