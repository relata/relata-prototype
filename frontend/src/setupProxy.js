const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/oauth/*",
    proxy({
      target: "http://localhost:3030",
      changeOrigin: true
    })
  );
};
