const { metadata } = require("./metadata");

/** @typedef {import("siteSettingsInterface.ts").SiteConfig } */
const siteConfig = {
  ...metadata,

  // Configure analytics - Privacy-focused analytics setup
  disableAnalytics: false, // Disable all analytics on the site
  analytics: {
    googleAnalytics: {
      googleAnalyticsId:
        process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-XXXXXXXXXX", // Replace with actual GA4 ID when available
    },
  },
};

module.exports = { siteConfig };
