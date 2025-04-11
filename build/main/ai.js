"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImageWithAI = processImageWithAI;
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Process an image with AI using OpenRouter API
 * @param base64Image - Base64 encoded image data (without the data URI prefix)
 * @param apiKey - OpenRouter API key
 * @returns Promise<string> - The AI response text
 */
async function processImageWithAI(base64Image, apiKey) {
    try {
        // Prepare the request to OpenRouter API
        const url = 'https://openrouter.ai/api/v1/chat/completions';
        // Add the data URI prefix to the base64 image
        const imageDataUri = `data:image/png;base64,${base64Image}`;
        // Create the request body according to the OpenRouter API specifications
        const requestBody = {
            model: 'google/gemini-2.0-flash-thinking-exp:free',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Describe what you see in this screenshot. Be concise but informative.' },
                        { type: 'image_url', image_url: { url: imageDataUri } }
                    ]
                }
            ],
            max_tokens: 1024
        };
        // Make the API request
        const response = await (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://screenshot-ai-app.local', // Required by OpenRouter
                'X-Title': 'Screenshot AI App' // Optional - helps with analytics in OpenRouter
            },
            body: JSON.stringify(requestBody)
        });
        // Check if the request was successful
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData}`);
        }
        // Parse the response
        const data = await response.json();
        // Extract the AI response text
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
            const content = data.choices[0].message.content;
            return typeof content === 'string' ? content : JSON.stringify(content);
        }
        else {
            throw new Error('Invalid response format from OpenRouter API');
        }
    }
    catch (error) {
        console.error('Error processing image with AI:', error);
        throw new Error(`Failed to process image with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=ai.js.map