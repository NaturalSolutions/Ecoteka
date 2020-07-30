const assetPrefix = process.env["ASSET_PREFIX"] || "";
const apiUrl = process.env["API_URL"] || "http://localhost:8000/api/v1";

let config = {};

// CDN Support with Asset Prefix
// https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
config.assetPrefix = assetPrefix;

config.env = {
  assetPrefix: assetPrefix,
};

config.publicRuntimeConfig = {
  apiUrl: apiUrl,
};

module.exports = config;
