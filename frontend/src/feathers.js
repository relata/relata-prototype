import feathers from "@feathersjs/client";

// Initialize Feathers REST client
const client = feathers();
client
  .configure(feathers.rest().fetch(window.fetch))
  .configure(feathers.authentication({ storage: window.localStorage }));

export { client };
