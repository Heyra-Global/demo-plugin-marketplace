#!/usr/bin/env node
/**
 * Smoke test for the bundled brand-assets MCP server.
 * Starts the server, runs initialize -> tools/list -> tools/call -> resources/read,
 * and exits non-zero if any answer is wrong. CI runs this. You can too:
 *   node plugins/nordlys-brand/mcp/smoke-test.js
 */
"use strict";
const { spawn } = require("child_process");
const path = require("path");
const assert = require("assert");

const server = spawn(process.execPath, [path.join(__dirname, "brand-assets-server.js")], {
  stdio: ["pipe", "pipe", "inherit"],
});
const pending = new Map();
let nextId = 1;
let buf = "";
server.stdout.setEncoding("utf8");
server.stdout.on("data", (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    const p = pending.get(msg.id);
    if (p) {
      pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    }
  }
});
function call(method, params) {
  const id = nextId++;
  server.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
function notify(method, params) {
  server.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}

(async () => {
  const init = await call("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "smoke", version: "0" },
  });
  assert.strictEqual(init.serverInfo.name, "nordlys-brand-assets");
  notify("notifications/initialized", {});

  const tools = await call("tools/list", {});
  const names = tools.tools.map((t) => t.name).sort();
  assert.deepStrictEqual(names, ["check_contrast", "get_banned_words", "get_color", "get_logo_svg", "get_palette"]);

  const color = await call("tools/call", { name: "get_color", arguments: { name: "aurora green" } });
  assert.ok(color.content[0].text.includes("#2EE6A6"), "get_color returns the Aurora Green hex");

  const contrast = await call("tools/call", {
    name: "check_contrast",
    arguments: { foreground: "Ice White", background: "Polar Night" },
  });
  const c = JSON.parse(contrast.content[0].text);
  assert.ok(c.ratio > 15 && c.passesAA_normalText, "Ice White on Polar Night passes AA");

  const bad = await call("tools/call", { name: "get_color", arguments: { name: "Hot Pink" } });
  assert.strictEqual(bad.isError, true, "an unknown color is a tool error, not a crash");

  const res = await call("resources/read", { uri: "nordlys://logo.svg" });
  assert.ok(res.contents[0].text.startsWith("<svg"), "the logo resource is SVG");

  console.log(`brand-assets MCP smoke test: OK (5 tools, Ice White on Polar Night = ${c.ratio}:1)`);
  server.stdin.end();
})().catch((err) => {
  console.error("brand-assets MCP smoke test FAILED:", err.message);
  server.kill();
  process.exit(1);
});
