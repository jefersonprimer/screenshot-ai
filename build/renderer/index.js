"use strict";
// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const notificationContainer = document.getElementById('notification-container');
    const responseTextElement = document.getElementById('response-text');
    const closeButton = document.getElementById('close-button');
    // Show the notification container
    if (notificationContainer) {
        notificationContainer.classList.remove('hidden');
    }
    // Handle close button click
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            window.api.invoke('close-notification');
        });
    }
    // Listen for AI responses from the main process
    window.api.receive('ai-response', (response) => {
        if (responseTextElement) {
            responseTextElement.textContent = response;
        }
    });
    // Listen for status updates
    window.api.receive('status-update', (status) => {
        if (responseTextElement) {
            responseTextElement.textContent = status;
        }
    });
});
//# sourceMappingURL=index.js.map