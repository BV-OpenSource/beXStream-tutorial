// proxy.conf.prod.js
const defaultTarget = 'https://bexstream.beyond-vision.com';
const target = process.env.PROXY_TARGET || defaultTarget;

const PROXY_CONFIG = {
  "/api": {
    "target": target,
    "secure": false,
    "changeOrigin": true
  }
};

module.exports = PROXY_CONFIG;
