import { desktopCapturer, screen } from 'electron';

/**
 * Captures a screenshot of the entire screen and returns it as a base64 encoded string
 * @returns Promise<string> - The base64 encoded screenshot
 */
export async function captureScreenshot(): Promise<string> {
  try {
    // Get the primary display
    const primaryDisplay = screen.getPrimaryDisplay();
    const { id } = primaryDisplay;

    // Capture the screen content
    const sources = await desktopCapturer.getSources({
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
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
