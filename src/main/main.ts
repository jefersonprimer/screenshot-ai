import { app, BrowserWindow, globalShortcut, dialog, ipcMain, shell } from 'electron';
import path from 'path';
import { setupTray } from './tray';
import { captureScreenshot } from './screenshot';
import { processImageWithAI } from './ai';

// Keep a global reference of the window object to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let notificationWindow: BrowserWindow | null = null;

// API Key from OpenRouter (load from environment variable or use default for testing)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Register IPC handlers
function registerIpcHandlers() {
  ipcMain.handle('open-external-link', (_, url) => {
    shell.openExternal(url);
  });

  ipcMain.handle('close-notification', () => {
    if (notificationWindow) {
      notificationWindow.close();
      notificationWindow = null;
    }
  });
}

// Create the main hidden window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Hide the window initially
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Only show DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create a notification window to display AI results
function createNotificationWindow(aiResponse: string) {
  // Close existing notification window if it exists
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
  }

  notificationWindow = new BrowserWindow({
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
    hasShadow: false, // Remove shadow to be less detectable
    titleBarStyle: 'hidden', // Hide title bar completely
    opacity: 0.95, // Slight transparency to make it less visible to recorders
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Position the window in the bottom right corner
  const { width, height } = notificationWindow.getBounds();
  const { width: screenWidth, height: screenHeight } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  notificationWindow.setPosition(screenWidth - width - 20, screenHeight - height - 20);

  notificationWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

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
  const registered = globalShortcut.register('CommandOrControl+Shift+P', async () => {
    try {
      // Show a notification that a screenshot is being taken
      if (mainWindow) {
        mainWindow.webContents.send('status-update', 'Taking screenshot...');
      }

      // Capture the screenshot
      const screenshotBase64 = await captureScreenshot();
      
      if (!screenshotBase64) {
        throw new Error('Failed to capture screenshot');
      }

      // Show notification that screenshot was captured
      if (mainWindow) {
        mainWindow.webContents.send('status-update', 'Processing with AI...');
      }

      // Process with AI
      const aiResponse = await processImageWithAI(screenshotBase64, OPENROUTER_API_KEY);
      
      // Show the AI response in a notification window
      createNotificationWindow(aiResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dialog.showErrorBox('Error', `Failed to process screenshot: ${errorMessage}`);
    }
  });

  if (!registered) {
    dialog.showErrorBox('Error', 'Could not register keyboard shortcut (Ctrl+Shift+P)');
  }
}

// App initialization
app.whenReady().then(() => {
  createMainWindow();
  setupTray(app, mainWindow);
  registerShortcuts();
  registerIpcHandlers();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, recreate a window when the dock icon is clicked and no windows are open
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Clean up shortcuts when app is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
