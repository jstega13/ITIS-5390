// Chat-specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeChatList();
    initializeChatCompose();
    initializeChatFilters();
});

// Chat List Interactions
function initializeChatList() {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all chats
            chatItems.forEach(chat => chat.classList.remove('active'));
            // Add active class to clicked chat
            this.classList.add('active');
            // Remove unread status
            this.classList.remove('unread');
            
            // Update the top bar with chat info
            updateChatHeader(this);
        });
    });
}

// Update Chat Header
function updateChatHeader(chatItem) {
    const chatName = chatItem.querySelector('.chat-name').textContent;
    const chatAvatar = chatItem.querySelector('.chat-avatar, .group-avatar');
    const chatStatus = chatItem.querySelector('.chat-status');
    
    const topBarInfo = document.querySelector('.channel-info');
    const topBarAvatar = topBarInfo.querySelector('.top-bar-avatar');
    const topBarTitle = topBarInfo.querySelector('h1');
    const topBarStatus = topBarInfo.querySelector('.channel-description');
    
    if (topBarTitle) {
        topBarTitle.textContent = chatName;
    }
    
    if (topBarAvatar && chatAvatar) {
        if (chatAvatar.classList.contains('chat-avatar')) {
            topBarAvatar.src = chatAvatar.src;
            topBarAvatar.style.display = 'block';
        } else {
            topBarAvatar.style.display = 'none';
        }
    }
    
    if (topBarStatus && chatStatus) {
        const statusIndicator = topBarStatus.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator';
            if (chatStatus.classList.contains('online')) {
                statusIndicator.classList.add('online');
                topBarStatus.innerHTML = '<span class="status-indicator online"></span>Available';
            } else if (chatStatus.classList.contains('away')) {
                statusIndicator.classList.add('away');
                topBarStatus.innerHTML = '<span class="status-indicator away"></span>Away';
            } else if (chatStatus.classList.contains('busy')) {
                statusIndicator.classList.add('busy');
                topBarStatus.innerHTML = '<span class="status-indicator busy"></span>Busy';
            } else {
                statusIndicator.classList.add('offline');
                topBarStatus.innerHTML = '<span class="status-indicator offline"></span>Offline';
            }
        }
    }
}

// Chat Compose
function initializeChatCompose() {
    const composeInput = document.querySelector('.compose-input');
    const sendBtn = document.querySelector('.send-btn');
    
    if (sendBtn && composeInput) {
        sendBtn.addEventListener('click', function() {
            const message = composeInput.value.trim();
            if (message) {
                sendChatMessage(message);
                composeInput.value = '';
            }
        });
        
        // Send on Enter (without Shift)
        composeInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = this.value.trim();
                if (message) {
                    sendChatMessage(message);
                    this.value = '';
                }
            }
        });
        
        // Show typing indicator
        let typingTimeout;
        composeInput.addEventListener('input', function() {
            clearTimeout(typingTimeout);
            // In a real app, you would send a "typing" event to the server
            typingTimeout = setTimeout(() => {
                // Stop typing indicator
            }, 1000);
        });
    }
}

// Send Chat Message
function sendChatMessage(messageText) {
    const messagesContainer = document.querySelector('.messages-container');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    // Remove typing indicator if present
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
    
    const messageHTML = `
        <div class="message sent">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-time">${currentTime}</span>
                </div>
                <div class="message-body">
                    <p>${escapeHtml(messageText)}</p>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate response after a delay
    setTimeout(() => {
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        setTimeout(() => {
            simulateResponse();
        }, 2000);
    }, 1000);
}

// Simulate Response
function simulateResponse() {
    const messagesContainer = document.querySelector('.messages-container');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const responses = [
        "That sounds great! Let me know if you need any help.",
        "Thanks for the update! 👍",
        "I'll take a look at that right away.",
        "Perfect timing! I was just about to ask you about that.",
        "Absolutely! When would be a good time to discuss?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
    
    const messageHTML = `
        <div class="message received">
            <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=0078d4&color=fff" alt="Sarah Johnson" class="message-avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">Sarah Johnson</span>
                    <span class="message-time">${currentTime}</span>
                </div>
                <div class="message-body">
                    <p>${randomResponse}</p>
                </div>
                <div class="message-reactions">
                    <button class="reaction-add">
                        <i class="far fa-smile"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Update chat preview in sidebar
    updateChatPreview(randomResponse, currentTime);
}

// Update Chat Preview in Sidebar
function updateChatPreview(message, time) {
    const activeChat = document.querySelector('.chat-item.active');
    if (activeChat) {
        const chatMessage = activeChat.querySelector('.chat-message');
        const chatTime = activeChat.querySelector('.chat-time');
        
        if (chatMessage) {
            chatMessage.textContent = message;
        }
        if (chatTime) {
            chatTime.textContent = time;
        }
    }
}

// Chat Filters
function initializeChatFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all filters
            filterBtns.forEach(filter => filter.classList.remove('active'));
            // Add active class to clicked filter
            this.classList.add('active');
            
            const filterType = this.textContent.toLowerCase();
            filterChats(filterType);
        });
    });
}

// Filter Chats
function filterChats(filterType) {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        switch(filterType) {
            case 'all':
                item.style.display = 'flex';
                break;
            case 'unread':
                if (item.classList.contains('unread')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
                break;
            case 'meetings':
                // In a real app, you would filter by meeting chats
                item.style.display = 'none';
                break;
            default:
                item.style.display = 'flex';
        }
    });
}

// Search Chats
const chatSearchInput = document.querySelector('.search-box input');
if (chatSearchInput) {
    chatSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
            const chatMessage = item.querySelector('.chat-message').textContent.toLowerCase();
            
            if (chatName.includes(searchTerm) || chatMessage.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Utility function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('Chat functionality initialized!');
