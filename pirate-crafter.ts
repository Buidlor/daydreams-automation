import { createDreams, validateEnv, context, render } from "@daydreamsai/core";
import { cli } from "@daydreamsai/core/extensions";
import { groq } from "@ai-sdk/groq";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  takeScreenshotAction,
  moveMouseAction,
  clickMouseAction,
  getCursorPositionAction,
} from "./computer-actions";

const browserContext = context({
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
        url: memory.url || "Not set",
        width: String(memory.windowSize.width),
        height: String(memory.windowSize.height),
        lastAction: memory.lastAction,
      },
    );
  },
});

// Start with just foundry tab position
const UI_POSITIONS = {
  foundryTab: { x: 265, y: 265 },
};

async function main() {
  let agent;
  try {
    agent = await createDreams({
      model: anthropic("claude-3-5-sonnet-20240620"),
      extensions: [cli],
      context: browserContext,
      actions: [
        takeScreenshotAction,
        moveMouseAction,
        clickMouseAction,
        getCursorPositionAction,
      ],
    });
    // Add signal handlers for cleanup
    const cleanup = () => {
      console.log("Cleaning up...");
      agent?.stop?.();
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      cleanup();
    });
    await agent.start({
      browserName: "Google Chrome",
      windowSize: { width: 1280, height: 800 },
    });
  } catch (error) {
    console.error("error in amin: ", error);
    process.exit(1);
  }
}

main().catch(console.error);
