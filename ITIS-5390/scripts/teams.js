// Channel data for different channels
const channelData = {
    general: {
        name: "General",
        description: "Team-wide announcements and discussions",
        messages: [
            {
                author: "Sarah Johnson",
                avatar: "Sarah+Johnson",
                background: "0078d4",
                time: "9:30 AM",
                content: "Good morning team! 👋 Just a reminder that we have our sprint planning meeting at 2 PM today. Please review the backlog items before the meeting.",
                reactions: [
                    { emoji: "👍", count: 3 },
                    { emoji: "❤️", count: 2 }
                ]
            },
            {
                author: "Michael Chen",
                avatar: "Michael+Chen",
                background: "6264a7",
                time: "10:15 AM",
                content: "Thanks Sarah! I've already gone through the backlog. Looking forward to the discussion.",
                reactions: [
                    { emoji: "👍", count: 1 }
                ]
            },
            {
                author: "Emily Rodriguez",
                avatar: "Emily+Rodriguez",
                background: "c239b3",
                time: "11:45 AM",
                content: "Quick update: The new design mockups are ready for review. I've uploaded them to the Files tab.",
                attachment: {
                    name: "Design_Mockups_v2.fig",
                    size: "2.4 MB"
                },
                reactions: [
                    { emoji: "🎨", count: 4 },
                    { emoji: "👍", count: 2 }
                ]
            },
            {
                author: "David Kim",
                avatar: "David+Kim",
                background: "00a4ef",
                time: "1:20 PM",
                content: "Great work Emily! The mockups look fantastic. I have a few suggestions:",
                list: [
                    "Consider increasing the contrast on the CTA buttons",
                    "The mobile layout needs some spacing adjustments",
                    "Love the new color scheme! 🎨"
                ],
                reactions: [
                    { emoji: "👍", count: 1 }
                ]
            }
        ]
    },
    development: {
        name: "Development",
        description: "Code reviews, technical discussions, and sprint updates",
        messages: [
            {
                author: "Ryan Crosby",
                avatar: "Ryan+Crosby",
                background: "7b68ee",
                time: "8:45 AM",
                content: "Morning devs! 💻 I've pushed the latest changes to the feature branch. Please pull and test locally before the code review.",
                reactions: [
                    { emoji: "👍", count: 5 },
                    { emoji: "🚀", count: 2 }
                ]
            },
            {
                author: "Julian Stegall",
                avatar: "Julian+Stegall",
                background: "ff6347",
                time: "9:30 AM",
                content: "Just pulled the changes. The new API integration looks solid! Running tests now.",
                reactions: [
                    { emoji: "✅", count: 2 }
                ]
            },
            {
                author: "Michael Chen",
                avatar: "Michael+Chen",
                background: "6264a7",
                time: "10:00 AM",
                content: "Quick question: Are we using the new authentication flow for all endpoints or just the user management ones?",
                reactions: [
                    { emoji: "🤔", count: 1 }
                ]
            },
            {
                author: "Ryan Crosby",
                avatar: "Ryan+Crosby",
                background: "7b68ee",
                time: "10:15 AM",
                content: "All endpoints! We're deprecating the old auth system completely in this release. Documentation is in the /docs folder.",
                reactions: [
                    { emoji: "👍", count: 3 },
                    { emoji: "📚", count: 1 }
                ]
            }
        ]
    },
    design: {
        name: "Design",
        description: "Design reviews, mockups, and creative collaboration",
        messages: [
            {
                author: "Emily Rodriguez",
                avatar: "Emily+Rodriguez",
                background: "c239b3",
                time: "9:00 AM",
                content: "Hey design team! 🎨 I've updated the component library with the new button styles. Check out the Figma file for details.",
                reactions: [
                    { emoji: "🎨", count: 6 },
                    { emoji: "✨", count: 3 }
                ]
            },
            {
                author: "David Kim",
                avatar: "David+Kim",
                background: "00a4ef",
                time: "10:30 AM",
                content: "Love the new styles! Question: Should we apply the same rounded corners to input fields too?",
                reactions: [
                    { emoji: "👍", count: 2 }
                ]
            },
            {
                author: "Emily Rodriguez",
                avatar: "Emily+Rodriguez",
                background: "c239b3",
                time: "11:00 AM",
                content: "Yes! Consistency is key. I'll update the input components this afternoon and share the mockups.",
                reactions: [
                    { emoji: "👍", count: 4 }
                ]
            },
            {
                author: "Sarah Johnson",
                avatar: "Sarah+Johnson",
                background: "0078d4",
                time: "2:15 PM",
                content: "The new color palette is looking great! Can we schedule a quick sync to discuss the dark mode variants?",
                reactions: [
                    { emoji: "🌙", count: 3 },
                    { emoji: "👍", count: 2 }
                ]
            }
        ]
    },
    marketing: {
        name: "Marketing",
        description: "Campaigns, content strategy, and market analysis",
        messages: [
            {
                author: "Sarah Johnson",
                avatar: "Sarah+Johnson",
                background: "0078d4",
                time: "8:30 AM",
                content: "Good morning marketing team! 📢 Our Q4 campaign performance exceeded expectations. Let's discuss expansion strategies in today's meeting.",
                reactions: [
                    { emoji: "🎉", count: 5 },
                    { emoji: "📈", count: 4 }
                ]
            },
            {
                author: "Alex Martinez",
                avatar: "Alex+Martinez",
                background: "ff8c00",
                time: "9:45 AM",
                content: "Fantastic news! I've prepared a breakdown of which channels performed best. Email had a 45% open rate!",
                reactions: [
                    { emoji: "🔥", count: 3 },
                    { emoji: "👍", count: 2 }
                ]
            },
            {
                author: "David Kim",
                avatar: "David+Kim",
                background: "00a4ef",
                time: "11:20 AM",
                content: "Should we increase budget allocation to social media? Our Instagram engagement is up 60% this quarter.",
                reactions: [
                    { emoji: "📱", count: 3 }
                ]
            },
            {
                author: "Sarah Johnson",
                avatar: "Sarah+Johnson",
                background: "0078d4",
                time: "1:00 PM",
                content: "Definitely! Let's schedule a budget review meeting for tomorrow. Great work everyone! 💪",
                reactions: [
                    { emoji: "👍", count: 6 },
                    { emoji: "🙌", count: 2 }
                ]
            }
        ]
    }
};

// Function to render messages for a channel
function renderMessages(channelKey) {
    const channel = channelData[channelKey];
    const messagesContainer = document.querySelector('.messages-container');
    
    messagesContainer.innerHTML = '';
    
    channel.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        let messageHTML = `
            <img src="https://ui-avatars.com/api/?name=${msg.avatar}&background=${msg.background}&color=fff"
                 alt="${msg.author}" class="message-avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${msg.author}</span>
                    <span class="message-time">${msg.time}</span>
                </div>
                <div class="message-body">
                    <p>${msg.content}</p>
        `;
        
        if (msg.list) {
            messageHTML += '<ul>';
            msg.list.forEach(item => {
                messageHTML += `<li>${item}</li>`;
            });
            messageHTML += '</ul>';
        }
        
        if (msg.attachment) {
            messageHTML += `
                <div class="message-attachment">
                    <i class="fas fa-file-image"></i>
                    <div class="attachment-info">
                        <span class="attachment-name">${msg.attachment.name}</span>
                        <span class="attachment-size">${msg.attachment.size}</span>
                    </div>
                    <button class="icon-btn-small">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            `;
        }
        
        messageHTML += '</div><div class="message-reactions">';
        
        msg.reactions.forEach(reaction => {
            messageHTML += `<button class="reaction">${reaction.emoji} ${reaction.count}</button>`;
        });
        
        messageHTML += `
                    <button class="reaction-add">
                        <i class="far fa-smile"></i>
                    </button>
                </div>
            </div>
        `;
        
        messageDiv.innerHTML = messageHTML;
        messagesContainer.appendChild(messageDiv);
    });
}

// Function to update channel header
function updateChannelHeader(channelKey) {
    const channel = channelData[channelKey];
    const channelInfo = document.querySelector('.channel-info');
    
    channelInfo.innerHTML = `
        <h1><i class="fas fa-hashtag"></i> ${channel.name}</h1>
        <span class="channel-description">${channel.description}</span>
    `;
}

// Function to switch channels
function switchChannel(channelKey) {
    // Update active state in sidebar
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const clickedChannel = Array.from(document.querySelectorAll('.channel-item')).find(
        item => item.textContent.trim().toLowerCase() === channelKey
    );
    
    if (clickedChannel) {
        clickedChannel.classList.add('active');
    }
    
    // Update content
    updateChannelHeader(channelKey);
    renderMessages(channelKey);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all channel items
    const channelItems = document.querySelectorAll('.channel-item');
    
    channelItems.forEach(item => {
        item.addEventListener('click', function() {
            const channelName = this.textContent.trim().toLowerCase();
            switchChannel(channelName);
        });
    });
    
    // Initialize with General channel
    switchChannel('general');
});
