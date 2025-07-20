const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
    serverExternalPackages: ["puppeteer-core"],
    webpack: (config) => {
        config.module.rules.push({
            test: /\.map$/,
            use: "ignore-loader",
        });
        return config;
    },
};

// Bundle analyzer
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));
