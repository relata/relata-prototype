const {
  AuthenticationService,
  JWTStrategy
} = require("@feathersjs/authentication");
const {
  OAuthStrategy,
  expressOauth
} = require("@feathersjs/authentication-oauth");

class GitHubStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      githubUsername: profile.login
    };
  }
}

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("github", new GitHubStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
