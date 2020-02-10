const {
  AuthenticationService,
  JWTStrategy
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const {
  OAuthStrategy,
  expressOauth
} = require("@feathersjs/authentication-oauth");

class ZoteroStrategy extends OAuthStrategy {
  async getProfile(oauth, params) {
    return {
      id: oauth.raw.userID,
      username: oauth.raw.username
    };
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      username: profile.username,
      displayName: profile.username
    };
  }
}

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("zotero", new ZoteroStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
