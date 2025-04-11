"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const tray_1 = require("./tray");
const screenshot_1 = require("./screenshot");
const ai_1 = require("./ai");
// Keep a global reference of the window object to prevent garbage collection
let mainWindow = null;
let notificationWindow = null;
// API Key from OpenRouter (load from environment variable or use default for testing)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
// Register IPC handlers
function registerIpcHandlers() {
    electron_1.ipcMain.handle('open-external-link', (_, url) => {
        electron_1.shell.openExternal(url);
    });
    electron_1.ipcMain.handle('close-notification', () => {
        if (notificationWindow) {
            notificationWindow.close();
            notificationWindow = null;
        }
    });
}
// Create the main hidden window
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        show: false, // Hide the window initially
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.loadFile(path_1.default.join(__dirname, '../renderer/index.html'));
    // Only show DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
// Create a notification window to display AI results
function createNotificationWindow(aiResponse) {
    // Close existing notification window if it exists
    if (notificationWindow && !notificationWindow.isDestroyed()) {
        notificationWindow.close();
    }
    notificationWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
        // Make window invisible to screen recording software
        type: 'toolbar',
        focusable: false, // Prevents the window from taking focus
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    // Position the window in the bottom right corner
    const { width, height } = notificationWindow.getBounds();
    const { width: screenWidth, height: screenHeight } = require('electron').screen.getPrimaryDisplay().workAreaSize;
    notificationWindow.setPosition(screenWidth - width - 20, screenHeight - height - 20);
    notificationWindow.loadFile(path_1.default.join(__dirname, '../renderer/index.html'));
    // Wait for the window to load and then send the AI response
    notificationWindow.webContents.on('did-finish-load', () => {
        notificationWindow?.webContents.send('ai-response', aiResponse);
    });
    notificationWindow.on('closed', () => {
        notificationWindow = null;
    });
}
// Register global shortcuts
function registerShortcuts() {
    // Register the screenshot shortcut (Ctrl+Shift+P)
    const registered = electron_1.globalShortcut.register('CommandOrControl+Shift+P', async () => {
        try {
            // Show a notification that a screenshot is being taken
            if (mainWindow) {
                mainWindow.webContents.send('status-update', 'Taking screenshot...');
            }
            // Capture the screenshot
            const screenshotBase64 = await (0, screenshot_1.captureScreenshot)();
            if (!screenshotBase64) {
                throw new Error('Failed to capture screenshot');
            }
            // Show notification that screenshot was captured
            if (mainWindow) {
                mainWindow.webContents.send('status-update', 'Processing with AI...');
            }
            // Process with AI
            const aiResponse = await (0, ai_1.processImageWithAI)(screenshotBase64, OPENROUTER_API_KEY);
            // Show the AI response in a notification window
            createNotificationWindow(aiResponse);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            electron_1.dialog.showErrorBox('Error', `Failed to process screenshot: ${errorMessage}`);
        }
    });
    if (!registered) {
        electron_1.dialog.showErrorBox('Error', 'Could not register keyboard shortcut (Ctrl+Shift+P)');
    }
}
// App initialization
electron_1.app.whenReady().then(() => {
    createMainWindow();
    (0, tray_1.setupTray)(electron_1.app, mainWindow);
    registerShortcuts();
    registerIpcHandlers();
});
// Quit when all windows are closed, except on macOS
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    // On macOS, recreate a window when the dock icon is clicked and no windows are open
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
// Clean up shortcuts when app is about to quit
electron_1.app.on('will-quit', () => {
    electron_1.globalShortcut.unregisterAll();
});
//# sourceMappingURL=main.js.map