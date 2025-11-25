// Microsoft Teams UI Clone - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTeams();
    initializeChannels();
    initializeCompose();
    initializeMessages();
});

// Navigation Rail
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // Navigate to the appropriate page
            navigateToPage(page);
        });
    });
}

// Navigate to different pages
function navigateToPage(page) {
    // Determine the base path dynamically
    let basePath = './'; // default: at root
    const pathParts = window.location.pathname.split('/');

    // If hosted on GitHub Pages, include the repo folder
    // e.g., '/ITIS-5390/pages/chat.html' → repoName = 'ITIS-5390'
    const repoName = pathParts[1] || '';
    if (repoName && repoName !== 'pages') {
        basePath = `/${repoName}/`;
    }

    // If currently inside /pages folder, go up one level
    if (pathParts.includes('pages')) {
        basePath += 'pages/';
    } else {
        basePath += 'pages/';
    }

    // Build the target path based on page
    let targetPath = '';
    switch (page) {
        case 'teams':
            targetPath = `${basePath}teams.html`;
            break;
        case 'live_rooms':
            targetPath = `${basePath}live_rooms.html`;
            break;
        case 'chat':
            targetPath = `${basePath}chat.html`;
            break;
        case 'calendar':
            targetPath = `${basePath}calendar.html`;
            break;
        case 'settings':
            targetPath = `${basePath}settings.html`;
            break;
        case 'files':
        case 'apps':
            alert(`${page.charAt(0).toUpperCase() + page.slice(1)} page coming soon!`);
            return;
    }

    // Navigate
    if (targetPath) {
        window.location.href = targetPath;
    }
}

// Teams Expansion/Collapse
function initializeTeams() {
    const teamHeaders = document.querySelectorAll('.team-header');
    
    teamHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            // Don't trigger if clicking on the more options button
            if (e.target.closest('.icon-btn-small')) {
                return;
            }
            
            const teamItem = this.closest('.team-item');
            const channelsList = teamItem.querySelector('.channels-list');
            const chevron = this.querySelector('i');
            
            if (channelsList) {
                // Toggle channels visibility
                if (channelsList.style.display === 'none') {
                    channelsList.style.display = 'block';
                    chevron.classList.remove('fa-chevron-right');
                    chevron.classList.add('fa-chevron-down');
                    this.classList.remove('collapsed');
                } else {
                    channelsList.style.display = 'none';
                    chevron.classList.remove('fa-chevron-down');
                    chevron.classList.add('fa-chevron-right');
                    this.classList.add('collapsed');
                }
            }
        });
    });
}

// Channel Selection
function initializeChannels() {
    const channelItems = document.querySelectorAll('.channel-item');
    
    channelItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all channels
            channelItems.forEach(channel => channel.classList.remove('active'));
            // Add active class to clicked channel
            this.classList.add('active');
            
            const channelName = this.querySelector('span').textContent;
            updateChannelHeader(channelName);
        });
    });
}

// Update Channel Header
function updateChannelHeader(channelName) {
    const channelInfo = document.querySelector('.channel-info h1');
    if (channelInfo) {
        channelInfo.innerHTML = `<i class="fas fa-hashtag"></i> ${channelName}`;
    }
}

// Compose Box Functionality
function initializeCompose() {
    const composeInput = document.querySelector('.compose-input');
    const sendBtn = document.querySelector('.send-btn');
    const formatBtns = document.querySelectorAll('.compose-format-btn');
    
    // Format buttons
    formatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Send button
    if (sendBtn && composeInput) {
        sendBtn.addEventListener('click', function() {
            const message = composeInput.value.trim();
            if (message) {
                sendMessage(message);
                composeInput.value = '';
            }
        });
        
        // Send on Ctrl+Enter
        composeInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                const message = this.value.trim();
                if (message) {
                    sendMessage(message);
                    this.value = '';
                }
            }
        });
    }
}

// Send Message
function sendMessage(messageText) {
    const messagesContainer = document.querySelector('.messages-container');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const messageHTML = `
        <div class="message">
            <img src="https://ui-avatars.com/api/?name=You&background=6264a7&color=fff" alt="You" class="message-avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">You</span>
                    <span class="message-time">${currentTime}</span>
                </div>
                <div class="message-body">
                    <p>${escapeHtml(messageText)}</p>
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
    
    // Reinitialize message interactions for new message
    initializeMessageInteractions();
}

// Message Interactions
function initializeMessages() {
    initializeMessageInteractions();
}

function initializeMessageInteractions() {
    // Reaction buttons
    const reactionBtns = document.querySelectorAll('.reaction');
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle reaction highlight
            this.style.backgroundColor = this.style.backgroundColor === 'rgb(98, 100, 167)' 
                ? 'var(--teams-white)' 
                : '#6264a7';
            this.style.color = this.style.color === 'rgb(255, 255, 255)' 
                ? 'var(--teams-text)' 
                : '#ffffff';
        });
    });
    
    // Add reaction buttons
    const reactionAddBtns = document.querySelectorAll('.reaction-add');
    reactionAddBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showEmojiPicker(this);
        });
    });
}

// Show Emoji Picker (simplified)
function showEmojiPicker(button) {
    const emojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const reactionsContainer = button.parentElement;
    const newReaction = document.createElement('button');
    newReaction.className = 'reaction';
    newReaction.textContent = `${randomEmoji} 1`;
    
    reactionsContainer.insertBefore(newReaction, button);
    
    // Add click handler to new reaction
    newReaction.addEventListener('click', function() {
        this.style.backgroundColor = this.style.backgroundColor === 'rgb(98, 100, 167)' 
            ? 'var(--teams-white)' 
            : '#6264a7';
        this.style.color = this.style.color === 'rgb(255, 255, 255)' 
            ? 'var(--teams-text)' 
            : '#ffffff';
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Tab Navigation
const tabItems = document.querySelectorAll('.tab-item');
tabItems.forEach(tab => {
    tab.addEventListener('click', function() {
        if (!this.querySelector('.fa-plus')) {
            tabItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const teamItems = document.querySelectorAll('.team-item');
        
        teamItems.forEach(item => {
            const teamName = item.querySelector('.team-name').textContent.toLowerCase();
            if (teamName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Top bar actions
const topBarActions = document.querySelectorAll('.top-bar-actions .icon-btn');
topBarActions.forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        let action = 'Unknown';
        
        if (icon.classList.contains('fa-video')) {
            action = 'Video call';
        } else if (icon.classList.contains('fa-phone')) {
            action = 'Audio call';
        } else if (icon.classList.contains('fa-desktop')) {
            action = 'Screen share';
        }
        
        console.log(`${action} clicked`);
        // Here you would implement actual call functionality
    });
});

// Auto-scroll to bottom of messages on load
const messagesContainer = document.querySelector('.messages-container');
if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Ctrl/Cmd + Shift + M for new message
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        const composeInput = document.querySelector('.compose-input');
        if (composeInput) {
            composeInput.focus();
        }
    }
});

console.log('Microsoft Teams UI Clone initialized successfully!');
