import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

const config = defineCloudflareConfig({
  // Invoice data lives in the browser; page shells only change on deployment.
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});

// Turbopack emits hashed external ESM imports that OpenNext cannot bundle.
// Use Webpack for the Worker build so the lazy PDF fallback includes regular React.
config.buildCommand = "pnpm build --webpack";

export default config;
