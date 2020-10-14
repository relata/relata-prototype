const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/oauth/*",
    createProxyMiddleware({
      target: "http://localhost:3030",
      changeOrigin: true
    })
  );
};
