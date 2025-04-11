# Screenshot AI

A private desktop application that captures screenshots with a keyboard shortcut and processes them with AI via OpenRouter API. The application operates completely invisibly to screen recording and call software.

## Description

Screenshot AI is an Electron-based desktop application that runs silently in the background. It allows users to capture screenshots with a keyboard shortcut, processes them with the Google Gemini AI model, and displays the analysis in a native popup. It is designed to be completely invisible to any type of screen recording or call software.

### Features

- **Invisible Operation**: Completely hidden from screen recording and call software
- **Background Operation**: Runs silently in the system tray
- **Quick Capture**: Take screenshots with Ctrl+Shift+P
- **AI Analysis**: Processes images with Google's Gemini 2.0 Flash model via OpenRouter
- **Minimal Interface**: Clean, non-intrusive notifications with AI results
- **Stealth Mode**: All UI components are designed to avoid detection by screen recording software

## Installation

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (v7 or higher)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/screenshot-ai.git
   cd screenshot-ai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the application:
   ```
   npx tsc
   ```

4. Run the application:
   ```
   electron build/main/main.js
   ```

## Packaging

To package the application into a desktop executable:

### For all platforms
```
npm install -g electron-builder
npm run build # This will run tsc to compile TypeScript
electron-builder
```

### Platform-specific builds
- Windows: `electron-builder --windows`
- Linux: `electron-builder --linux`
- macOS: `electron-builder --mac` (must be run on macOS)

The packaged applications will be in the `dist` folder.

## Technical Details

### Stealth Screenshot Capture
This application uses special techniques to remain invisible to screen recording and call software:

1. **Invisible Window Type**: The notification window uses the `toolbar` window type with `focusable: false`, making it invisible to most screen recording software.

2. **Stealth Screenshot Capture**: Using Electron's `desktopCapturer` with optimized settings to avoid detection during capture.

3. **No Focus Capturing**: The application never takes focus away from other windows, making its operation seamless and invisible.

### Screenshot Process
1. When the Ctrl+Shift+P shortcut is pressed, the application captures the entire screen.
2. The screenshot is converted to base64 format.
3. It's sent to the OpenRouter API with the Google Gemini 2.0 Flash model.
4. The AI analysis is displayed in a stealth notification window.

### API Request Structure
The application makes requests to OpenRouter with the following format:

```json
{
  "model": "google/gemini-2.0-flash-thinking-exp:free",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Describe what you see in this screenshot. Be concise but informative." },
        { "type": "image_url", "image_url": { "url": "data:image/png;base64,..." } }
      ]
    }
  ],
  "max_tokens": 1024
}
```

## Disclaimer

**IMPORTANT**: This application is for private use and educational purposes only.

- It is designed as a private tool and should not be distributed publicly.
- The stealth screenshot capabilities should only be used for legitimate purposes.
- The OpenRouter API key included in this project is for this private repository only.
- Users are responsible for ensuring their use of this software complies with all applicable laws and regulations.
- This application should not be used to capture sensitive or confidential information without proper authorization.
   