// Updated Janus Service

const Janus = require('janus-gateway');

const server = "https://bexstream.beyond-vision.com"; // Updated the URL

const janus = new Janus({
  server: server,
  // other Janus configurations...
});

module.exports = janus;