import { App, BrowserWindow, Menu, Tray, nativeImage, dialog } from 'electron';

let tray: Tray | null = null;

// Create a custom icon for the tray (using a simple SVG)
const createTrayIcon = (): string => {
  const svgIcon = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="black" stroke-width="2" fill="none"/>
    <circle cx="8" cy="8" r="3" fill="black"/>
  </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svgIcon).toString('base64')}`;
};

export function setupTray(app: App, _mainWindow: BrowserWindow | null): Tray {
  // Create the tray icon
  const icon = nativeImage.createFromDataURL(createTrayIcon());
  tray = new Tray(icon);
  tray.setToolTip('Screenshot AI');

  // Create the context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Screenshot AI',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Take Screenshot (Ctrl+Shift+P)',
      click: () => {
        // Simulate the keyboard shortcut
        const { globalShortcut } = require('electron');
        const registeredShortcuts = globalShortcut.getRegisteredAccelerators();
        
        if (registeredShortcuts.includes('CommandOrControl+Shift+P')) {
          // We don't call the handler directly but simulate the shortcut
          // as the handler is not exposed here
          dialog.showMessageBox({
            type: 'info',
            title: 'Screenshot AI',
            message: 'Press Ctrl+Shift+P to take a screenshot',
            buttons: ['OK']
          });
        }
      }
    },
    { type: 'separator' },
    {
      label: 'About',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'About Screenshot AI',
          message: 'Screenshot AI v1.0.0\n\nA private desktop application that captures screenshots and processes them with AI via OpenRouter.',
          buttons: ['OK']
        });
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // Return the tray instance
  return tray;
}
