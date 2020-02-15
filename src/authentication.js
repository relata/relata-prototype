const session = require("express-session");
const MemoryStore = require("memorystore")(session);
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
    const displayName = name || login;

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

    return {
      ...baseData,
      email: profile.email,
      username: profile.email,
      displayName: profile.name
    };
  }
}

class MendeleyStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    const { display_name, email, folder } = profile;
    const displayName = display_name || folder;

    return {
      ...baseData,
      email: email,
      username: folder,
      displayName: displayName
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
  authentication.register("github", new GitHubStrategy());
  authentication.register("google", new GoogleStrategy());
  authentication.register("mendeley", new MendeleyStrategy());
  authentication.register("zotero", new ZoteroStrategy());

  app.use("/authentication", authentication);
  app.configure(
    expressOauth({
      // Add production memory store for sessions (86400000 ms = 24 hours)
      expressSession: session({
        cookie: { maxAge: 86400000 },
        name: "relata-oauth",
        store: new MemoryStore({
          // Prune expired entries every 24 hours
          checkPeriod: 86400000,
          // Maximum number of entries in store
          max: 2000
        }),
        resave: false,
        saveUninitialized: false,
        secret: app.get("authentication").secret
      })
    })
  );
};
