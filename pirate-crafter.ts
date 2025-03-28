import { createDreams, validateEnv, context, render } from "@daydreamsai/core";
import { cli } from "@daydreamsai/core/extensions";
import { telegram } from "@daydreamsai/telegram";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  takeScreenshotAction,
  moveMouseAction,
  clickMouseAction,
  getCursorPositionAction,
} from "./computer-actions";

validateEnv(
  z.object({
    TELEGRAM_TOKEN: z.string().min(1, "TELEGRAM_TOKEN is required"),
    ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
  }),
);

const browserContext = context({
  type: "browser",
  schema: z.object({
    browserName: z.string().default("Google Chrome"),
    url: z.string().optional(),
    windowSize: z
      .object({
  type: "browser",
  schema: z.object({
    browserName: z.string().default("Google Chrome"),
    url: z.string().optional(),
    windowSize: z
      .object({
        width: z.number(),
        height: z.number(),
      })
      .optional(),
  }),
      })
      .optional(),
  }),

  key({ browserName }) {
    return browserName;
  },
  key({ browserName }) {
    return browserName;
  },

  create(state) {
    return {
      browserName: state.args.browserName,
      url: state.args.url,
      windowSize: state.args.windowSize || { width: 1280, height: 800 },
      lastAction: "initialized",
      screenshots: [],
    };
  },
  create(state) {
    return {
      browserName: state.args.browserName,
      url: state.args.url,
      windowSize: state.args.windowSize || { width: 1280, height: 800 },
      lastAction: "initialized",
      screenshots: [],
    };
  },

  render({ memory }) {
    return render(
      `
  render({ memory }) {
    return render(
      `
            Browser: {{browserName}}
            Current URL: {{url}}
            Window Size: {{width}}x{{height}}
            Last Action: {{lastAction}}
          `,
      {
        browserName: memory.browserName,
        url: memory.url || "https://piratenation.game/play",
        width: String(memory.windowSize.width),
        height: String(memory.windowSize.height),
        lastAction: memory.lastAction,
      },
    );
  },
});

const UI_POSITIONS = {
  craftingAnvil: { x: 265, y: 265 },
  foundryTab: { x: 265, y: 265 },
};

async function craftIronAnchors() {
  console.log("Crafting iron anchors");
}

async function main() {
  const agent = await createDreams({
    model: anthropic("claude-3-5-sonnet-20240620"),
    extensions: [cli, telegram],
    context: browserContext,
    actions: [
      takeScreenshotAction,
      moveMouseAction,
      clickMouseAction,
      getCursorPositionAction,
    ],
  }).start({
    browserName: "Google Chrome",
    windowSize: { width: 1280, height: 800 },
  });
}

main().catch(console.error);

