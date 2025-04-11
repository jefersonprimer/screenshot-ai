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

2. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the .env file if you want to use your own OpenRouter API key.

3. Install dependencies:
   ```
   npm install
   ```

4. Build the application:
   ```
   npx tsc
   ```

5. Run the application:
   ```
   electron build/main/main.js
   ```

### Shortcut
Once the application is running, use **Ctrl+Shift+P** to capture the current screen. The AI analysis will appear in a stealth notification window.

## Packaging

To package the application into a desktop executable that you can share or install:

### For all platforms
```
npm install -g electron-builder
npx tsc # Compile TypeScript
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

2. **Enhanced Window Properties**: Additional properties like `hasShadow: false`, `titleBarStyle: 'hidden'`, and slight opacity make the notification windows even harder to detect by recording software.

3. **Stealth Screenshot Capture**: Using Electron's `desktopCapturer` with optimized settings to avoid detection during capture.

4. **No Focus Capturing**: The application never takes focus away from other windows, making its operation seamless and invisible.

5. **Background Operation**: The main window remains hidden, with all interactions happening through the system tray icon.

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

### Environment Setup
To use the OpenRouter API for image analysis, you need to set up an API key:

1. Create an account at [OpenRouter](https://openrouter.ai)
2. Generate an API key under your account settings
3. Create a `.env` file in the root directory with:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

Or you can use the sample API key in .env.example by renaming it to .env (for testing purposes only).

## Disclaimer

**IMPORTANT**: This application is for private use and educational purposes only.

- It is designed as a private tool and should not be distributed publicly.
- The stealth screenshot capabilities should only be used for legitimate purposes.
- The OpenRouter API key included in this project is for this private repository only.
- Users are responsible for ensuring their use of this software complies with all applicable laws and regulations.
- This application should not be used to capture sensitive or confidential information without proper authorization.
   