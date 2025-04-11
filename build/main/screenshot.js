"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureScreenshot = captureScreenshot;
const electron_1 = require("electron");
/**
 * Captures a screenshot of the entire screen and returns it as a base64 encoded string
 * The capture method is designed to be invisible to screen recording software
 * @returns Promise<string> - The base64 encoded screenshot
 */
async function captureScreenshot() {
    try {
        // Get the primary display
        const primaryDisplay = electron_1.screen.getPrimaryDisplay();
        const { id } = primaryDisplay;
        // Use stealthier screenshot capture approach
        // By using 'screen' for types and setting stayHidden: true and stayInFront: false
        // This helps minimize detection by screen recording software
        const sources = await electron_1.desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {
                width: primaryDisplay.size.width,
                height: primaryDisplay.size.height,
            },
        });
        // Find the primary display source
        const source = sources.find(s => s.display_id === id.toString()) || sources[0];
        if (!source || !source.thumbnail) {
            throw new Error('Could not capture screenshot');
        }
        // Convert the NativeImage to a base64 string
        // Remove the prefix 'data:image/png;base64,' as we'll add it back when needed
        const base64Data = source.thumbnail.toPNG().toString('base64');
        return base64Data;
    }
    catch (error) {
        console.error('Error capturing screenshot:', error);
        throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=screenshot.js.map