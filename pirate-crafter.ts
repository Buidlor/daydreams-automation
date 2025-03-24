import { createDreams, validateEnv, context, render } from "@daydreamsai/core";
import { cli } from "@daydreamsai/core/extensions";
import { groq } from "@ai-sdk/groq";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import {
  takeScreenshotAction,
  moveMouseAction,
  clickMouseAction,
  getCursorPositionAction,
  
} from "./computer-actions";
import { ComputerTool } from "./base";

const browserContext = context({
    type: "browser",
    schema: z.object({
        browserName: z.string().default("Google Chrome"),
        url: z.string().optional(),
        windowSize: z.object({
        width: z.number(),
        height: z.number(),
        }).optional(),
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
          }
        );
      },
});

// Start with just foundry tab position
const UI_POSITIONS = {
  foundryTab: { x: 265, y: 265 },
};

async function main() {
  
  const agent = await createDreams({
    model: groq("deepseek-r1-distill-llama-70b"),
    extensions: [cli],
    context: browserContext,
    actions: [
      takeScreenshotAction,
      moveMouseAction,
      clickMouseAction,
      getCursorPositionAction
    ],
    
  }).start({
    browserName: "Google Chrome",
    windowSize: { width: 1280, height: 800 },
  });
}

main().catch(console.error);