import feathers from "@feathersjs/client";

// Initialize Feathers REST client
const client = feathers();
client.configure(feathers.rest().fetch(window.fetch));

export default client;
