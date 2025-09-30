// Chat history storage
let chatHistory = [];

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Load chat history from localStorage
function loadChatHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        chatHistory.forEach(message => addMessageToUI(message));
    }
}

// Save chat history to localStorage
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Add message to UI
function addMessageToUI(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = message.sender === 'user' ? 
        '<i class="fas fa-user"></i>' : 
        '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = message.text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user message and get AI response
async function processMessage(userMessage) {
    try {
        // Add user message to UI and history
        const userMessageObj = { sender: 'user', text: userMessage };
        addMessageToUI(userMessageObj);
        chatHistory.push(userMessageObj);

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.innerHTML = `
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                Typing...
            </div>
        `;
        chatMessages.appendChild(typingDiv);

        // Simulate AI response (replace with actual API call)
        const response = await getAIResponse(userMessage);

        // Remove typing indicator
        chatMessages.removeChild(typingDiv);

        // Add AI response to UI and history
        const botMessageObj = { sender: 'bot', text: response };
        addMessageToUI(botMessageObj);
        chatHistory.push(botMessageObj);

        // Save updated history
        saveChatHistory();

    } catch (error) {
        console.error('Error processing message:', error);
        alert('Sorry, there was an error processing your message. Please try again.');
    }
}

// API Configuration
const API_URL = '/api/chat'; // Updated to use backend proxy
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Delay helper function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// AI response generation using OpenAI API with retry mechanism
async function getAIResponse(userMessage) {
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    context: 'You are WealthMate, a knowledgeable financial advisor AI assistant. Provide helpful, accurate, and concise financial advice.'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`
                );
            }

            const data = await response.json();
            if (!data.choices?.[0]?.message?.content) {
                throw new Error('Invalid response format from API');
            }

            return data.choices[0].message.content.trim();

        } catch (error) {
            retries++;
            console.error(`API Error (attempt ${retries}/${MAX_RETRIES}):`, error);

            if (retries === MAX_RETRIES) {
                throw new Error(
                    'Unable to get AI response after multiple attempts. Please check your internet connection and try again.'
                );
            }

            // Wait before retrying
            await delay(RETRY_DELAY * retries);
        }
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            messageInput.value = '';
            processMessage(message);
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message) {
                messageInput.value = '';
                processMessage(message);
            }
        }
    });

    // Initialize chat
    loadChatHistory();
});