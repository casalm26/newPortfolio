const { metadata } = require("./metadata");

/** @typedef {import("siteSettingsInterface.ts").SiteConfig } */
const siteConfig = {
  ...metadata,

  disableAnalytics: false,
};

module.exports = { siteConfig };
