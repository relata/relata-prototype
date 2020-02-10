const {
  AuthenticationService,
  JWTStrategy
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const {
  OAuthStrategy,
  expressOauth
} = require("@feathersjs/authentication-oauth");

class GitHubStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    const { login, name, email } = profile;
    const displayName = name || `github.com/${login}`;

    return {
      ...baseData,
      email: email,
      username: login,
      displayName: displayName
    };
  }
}

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    const { name, email } = profile;

    return {
      ...baseData,
      email: email,
      displayName: name
    };
  }
}

class ZoteroStrategy extends OAuthStrategy {
  async getProfile(oauth, params) {
    return {
      id: oauth.raw.userID,
      username: oauth.raw.username
    };
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    const displayName = `zotero.org/${profile.username}`;

    return {
      ...baseData,
      username: profile.username,
      displayName: displayName
    };
  }
}

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("github", new GitHubStrategy());
  authentication.register("google", new GoogleStrategy());
  authentication.register("zotero", new ZoteroStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
