const { setField } = require("feathers-authentication-hooks");
const { iffElse } = require("feathers-hooks-common");

const isAdmin = async context => {
  const { user } = context.params;
  if (!user) {
    return context;
  } else {
    return user.isAdmin === 1;
  }
};

const passThrough = async context => context;

const limitToAdminOrThisUser = iffElse(
  isAdmin,
  passThrough,
  setField({
    from: "params.user.id",
    as: "params.query.id"
  })
);

const limitToAdminOrOwningUser = iffElse(
  isAdmin,
  passThrough,
  setField({
    from: "params.user.id",
    as: "params.query.userId"
  })
);

module.exports = {
  isAdmin,
  passThrough,
  limitToAdminOrThisUser,
  limitToAdminOrOwningUser
};
