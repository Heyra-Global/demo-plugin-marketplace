#!/usr/bin/env node
/**
 * brand-assets MCP server (bundled with the nordlys-brand plugin).
 *
 * A zero-dependency MCP server over stdio. It shows that a plugin can ship its
 * own MCP server: no npm install, no network access. Claude Code starts it with
 * `node ${CLAUDE_PLUGIN_ROOT}/mcp/brand-assets-server.js` (see ../.mcp.json).
 *
 * Tools:     get_palette, get_color, check_contrast, get_logo_svg, get_banned_words
 * Resources: nordlys://palette.json, nordlys://banned-words.json, nordlys://logo.svg
 *
 * Protocol: JSON-RPC 2.0, one JSON object per line on stdin and stdout.
 * Logs go to stderr only. stdout is reserved for protocol messages.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ASSETS = path.join(__dirname, "..", "assets");
const SERVER_INFO = { name: "nordlys-brand-assets", version: "1.0.0" };
const SUPPORTED_PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];

function readAsset(name) {
  return fs.readFileSync(path.join(ASSETS, name), "utf8");
}
function palette() {
  return JSON.parse(readAsset("palette.json"));
}
function bannedWords() {
  return JSON.parse(readAsset("banned-words.json"));
}

// --- WCAG 2.1 contrast -------------------------------------------------------
function hexToRgb(hex) {
  const h = String(hex).replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Invalid hex color: ${hex}`);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrastRatio(fg, bg) {
  const l1 = luminance(hexToRgb(fg));
  const l2 = luminance(hexToRgb(bg));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
function resolveColor(nameOrHex) {
  const s = String(nameOrHex || "").trim();
  if (/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(s)) return s.startsWith("#") ? s : `#${s}`;
  const c = palette().colors.find((x) => x.name.toLowerCase() === s.toLowerCase());
  if (!c) throw new Error(`Unknown brand color: ${nameOrHex}. Use get_palette to list the names.`);
  return c.hex;
}

// --- Tool definitions --------------------------------------------------------
const TOOLS = [
  {
    name: "get_palette",
    description: "Return the full Nordlys Analytics color palette, typography and logo rules as JSON.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_color",
    description: "Return one brand color by name (for example 'Aurora Green') with its hex value and role.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Color name, case-insensitive." } },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "check_contrast",
    description:
      "Compute the WCAG 2.1 contrast ratio between a foreground and a background color. Accepts brand color names or hex values. Reports whether the pair passes AA for normal and large text.",
    inputSchema: {
      type: "object",
      properties: {
        foreground: { type: "string", description: "Text color: brand name or hex." },
        background: { type: "string", description: "Background color: brand name or hex." },
      },
      required: ["foreground", "background"],
      additionalProperties: false,
    },
  },
  {
    name: "get_logo_svg",
    description: "Return the Nordlys Analytics logotype as SVG markup, ready to embed in HTML or slides.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_banned_words",
    description: "Return the list of words that must not appear in Nordlys copy, with suggested replacements.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function callTool(name, args) {
  switch (name) {
    case "get_palette":
      return JSON.stringify(palette(), null, 2);
    case "get_color": {
      const wanted = String(args.name || "").toLowerCase();
      const c = palette().colors.find((x) => x.name.toLowerCase() === wanted);
      if (!c) throw new Error(`Unknown brand color: ${args.name}. Use get_palette to list the names.`);
      return JSON.stringify(c, null, 2);
    }
    case "check_contrast": {
      const fg = resolveColor(args.foreground);
      const bg = resolveColor(args.background);
      const ratio = contrastRatio(fg, bg);
      return JSON.stringify(
        {
          foreground: fg,
          background: bg,
          ratio: Math.round(ratio * 100) / 100,
          passesAA_normalText: ratio >= 4.5,
          passesAA_largeText: ratio >= 3,
          passesAAA_normalText: ratio >= 7,
        },
        null,
        2
      );
    }
    case "get_logo_svg":
      return readAsset("nordlys-logo.svg");
    case "get_banned_words":
      return JSON.stringify(bannedWords(), null, 2);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const RESOURCES = [
  { uri: "nordlys://palette.json", name: "Nordlys palette", mimeType: "application/json", description: "Color palette, typography and logo rules." },
  { uri: "nordlys://banned-words.json", name: "Nordlys banned words", mimeType: "application/json", description: "Words that never appear in Nordlys copy." },
  { uri: "nordlys://logo.svg", name: "Nordlys logo", mimeType: "image/svg+xml", description: "Logotype as SVG." },
];
function readResource(uri) {
  const map = {
    "nordlys://palette.json": ["palette.json", "application/json"],
    "nordlys://banned-words.json": ["banned-words.json", "application/json"],
    "nordlys://logo.svg": ["nordlys-logo.svg", "image/svg+xml"],
  };
  const entry = map[uri];
  if (!entry) throw new Error(`Unknown resource: ${uri}`);
  return { uri, mimeType: entry[1], text: readAsset(entry[0]) };
}

// --- JSON-RPC plumbing -------------------------------------------------------
function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}
function reply(id, result) {
  send({ jsonrpc: "2.0", id, result });
}
function fail(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function handle(msg) {
  const { id, method, params = {} } = msg;
  const isNotification = id === undefined || id === null;
  try {
    switch (method) {
      case "initialize": {
        const requested = params.protocolVersion;
        const protocolVersion = SUPPORTED_PROTOCOLS.includes(requested) ? requested : SUPPORTED_PROTOCOLS[0];
        return reply(id, {
          protocolVersion,
          capabilities: { tools: { listChanged: false }, resources: { subscribe: false, listChanged: false } },
          serverInfo: SERVER_INFO,
          instructions:
            "Brand assets for Nordlys Analytics. Call get_palette before you choose colors, check_contrast before you pair a text color with a background, and get_banned_words before you write marketing copy.",
        });
      }
      case "notifications/initialized":
      case "notifications/cancelled":
      case "notifications/roots/list_changed":
        return; // notifications get no response
      case "ping":
        return reply(id, {});
      case "tools/list":
        return reply(id, { tools: TOOLS });
      case "tools/call": {
        try {
          const text = callTool(params.name, params.arguments || {});
          return reply(id, { content: [{ type: "text", text }], isError: false });
        } catch (err) {
          return reply(id, { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true });
        }
      }
      case "resources/list":
        return reply(id, { resources: RESOURCES });
      case "resources/read":
        return reply(id, { contents: [readResource(params.uri)] });
      case "resources/templates/list":
        return reply(id, { resourceTemplates: [] });
      case "prompts/list":
        return reply(id, { prompts: [] });
      default:
        if (!isNotification) fail(id, -32601, `Method not found: ${method}`);
    }
  } catch (err) {
    if (!isNotification) fail(id, -32603, err.message);
    else process.stderr.write(`[brand-assets] ${err.message}\n`);
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      fail(null, -32700, "Parse error");
      continue;
    }
    handle(msg);
  }
});
process.stdin.on("end", () => process.exit(0));
process.stderr.write("[brand-assets] MCP server ready\n");
