import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const handlerPath = resolve(".open-next/server-functions/default/handler.mjs");
const wasmPath = resolve(".open-next/server-functions/default/yoga.wasm");
const importStatement = 'import invoifyYogaWasm from "./yoga.wasm";';
const handler = readFileSync(handlerPath, "utf8");

function validateWasm(binary) {
  if (!binary.subarray(0, 8).equals(Buffer.from([0, 97, 115, 109, 1, 0, 0, 0]))) {
    throw new Error("The extracted Yoga module is not a valid WASM binary.");
  }
  // Validation happens in Node at build time, never in the Worker runtime.
  new WebAssembly.Module(binary);
}

if (handler.startsWith(importStatement)) {
  // Permit rerunning the preparation step against an already prepared bundle.
  if ((handler.match(/WebAssembly\.instantiate\(invoifyYogaWasm,/g) ?? []).length !== 1) {
    throw new Error("The prepared Cloudflare PDF bundle is incomplete; rebuild it before preview or deployment.");
  }
  validateWasm(readFileSync(wasmPath));
  process.exit(0);
}

// Yoga ships its binary as base64 and compiles it at runtime. Workers only
// instantiate precompiled WASM imports, so adapt the server bundle at build time.
const embeddedModules = [...handler.matchAll(/data:application\/octet-stream;base64,(AGFzb[A-Za-z0-9+/=]+)/g)];
const instantiateCalls = [...handler.matchAll(/WebAssembly\.instantiate\(([\w$]+),([\w$]+)\)/g)];
if (embeddedModules.length !== 1 || instantiateCalls.length !== 1) {
  throw new Error(`The Yoga WASM bundle changed after a dependency update: expected one payload and one instantiate call, found ${embeddedModules.length} and ${instantiateCalls.length}. Review scripts/prepareCloudflarePdf.mjs before building.`);
}
const binary = Buffer.from(embeddedModules[0][1], "base64");
validateWasm(binary);

const patchedHandler = handler
  // The loader still checks for a data URL; discard the duplicate encoded bytes.
  .replace(embeddedModules[0][0], "data:application/octet-stream;base64,")
  // Instantiating a Module returns an Instance; preserve the loader's result shape.
  .replace(instantiateCalls[0][0], `WebAssembly.instantiate(invoifyYogaWasm,${instantiateCalls[0][2]}).then(instance=>({instance,module:invoifyYogaWasm}))`);

writeFileSync(wasmPath, binary);
writeFileSync(handlerPath, `${importStatement}\n${patchedHandler}`);
console.log(`Prepared Cloudflare PDF layout WASM (${binary.length} bytes).`);
