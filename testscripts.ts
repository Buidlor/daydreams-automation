import { ComputerTool } from "./base";

// Start with just getting current mouse position to help calibrate
async function main() {
  const computerTool = new ComputerTool();
  try {
    const position = await computerTool.execute({
      action: "cursor_position",
    });

    const moveTo = await computerTool.execute({
      action: "mouse_move",
      coordinate: [500, 500],
    });
  } catch (error) {
    console.error("Failed to get params: ", error);
  }
}

main().catch(console.error);
