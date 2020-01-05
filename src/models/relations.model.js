// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const relations = sequelizeClient.define(
    "relations",
    // {
    //   text: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    //   }
    // },
    {
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      annotation: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true
        }
      },
      annotationAuthor: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      validate: {
        noAnnotationAuthorWithoutAnnotation() {
          if (this.annotation == null && this.annotationAuthor !== null) {
            throw new Error(
              "annotationAuthor was supplied without an annotation"
            );
          }
        }
      },
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  // eslint-disable-next-line no-unused-vars
  relations.associate = function(models) {
    relations.belongsTo(models.users);
    relations.belongsTo(models.works, { as: "workFrom" });
    relations.belongsTo(models.works, { as: "workTo" });
  };

  return relations;
};
