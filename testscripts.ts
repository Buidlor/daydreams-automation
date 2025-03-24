import { ComputerTool } from "./base";

// Start with just getting current mouse position to help calibrate
async function main() {
  const computerTool = new ComputerTool();
  try {  
    const screenshot = await computerTool.execute({
      action: "screenshot"
    });
    console.log("Screenshot:", screenshot);

  } catch (error) {
    console.error('Failed to getparams: ', error); 
  }
}

main().catch(console.error);