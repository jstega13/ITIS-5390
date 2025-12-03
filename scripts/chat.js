// =======================================
// InnovateSync Chat – Sarah only + popups
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    initChatSend();
    initSearch();
    initFilterButtons();
    initButtonPopups();
    initReactionDelegation();
    console.log('Chat prototype ready (Sarah only + popups).');
});

// ---------------------------
// Utility helpers
// ---------------------------
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// ---------------------------
// Sending + reply simulation
// ---------------------------
function initChatSend() {
    const input     = document.getElementById('compose-input');
    const sendBtn   = document.getElementById('send-btn');
    const container = document.getElementById('messages-container');

    if (!input || !sendBtn || !container) return;

    sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        appendSentMessage(text);
        input.value = '';
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            appendSentMessage(text);
            input.value = '';
        }
    });
}

function appendSentMessage(text) {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const time = formatTime();
    const safe = escapeHtml(text);

    // Hide typing indicator if somehow visible
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.style.display = 'none';

    const html = `
        <div class="message sent">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-body">
                    <p>${safe}</p>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;

    // Update chat sidebar preview + time
    const chatItem  = document.querySelector('.chat-item');
    const previewEl = chatItem?.querySelector('.chat-message');
    const timeEl    = chatItem?.querySelector('.chat-time');

    if (previewEl) previewEl.textContent = text;
    if (timeEl)    timeEl.textContent    = time;

    simulateSarahReply();
}

function simulateSarahReply() {
    const container = document.getElementById('messages-container');
    const typing    = document.getElementById('typing-indicator');
    if (!container || !typing) return;

    // Show typing indicator for Sarah
    typing.style.display = 'flex';
    container.scrollTop = container.scrollHeight;

    const replies = [
        "Got it, thanks for the quick response!",
        "Nice, that sounds perfect.",
        "Okay, I'll adjust the timeline based on that.",
        "Perfect, I’ll add that to the deck.",
        "Thanks! I’ll review it and let you know."
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
        typing.style.display = 'none';

        const time      = formatTime();
        const safeReply = escapeHtml(reply);

        const html = `
            <div class="message received">
                <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=0078d4&color=fff"
                     alt="Sarah Johnson" class="message-avatar">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">Sarah Johnson</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-body">
                        <p>${safeReply}</p>
                    </div>
                    <div class="message-reactions">
                        <button class="reaction">👍 1</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
        container.scrollTop = container.scrollHeight;

        // Update sidebar preview
        const chatItem  = document.querySelector('.chat-item');
        const previewEl = chatItem?.querySelector('.chat-message');
        const timeEl    = chatItem?.querySelector('.chat-time');

        if (previewEl) previewEl.textContent = reply;
        if (timeEl)    timeEl.textContent    = time;
    }, 1200);
}

// ---------------------------
// Search (even with one chat)
// ---------------------------
function initSearch() {
    const input = document.getElementById('chat-search-input');
    if (!input) return;

    input.addEventListener('input', () => {
        const term = input.value.toLowerCase();
        const item = document.querySelector('.chat-item');
        if (!item) return;

        const name    = item.querySelector('.chat-name')?.textContent.toLowerCase() || '';
        const preview = item.querySelector('.chat-message')?.textContent.toLowerCase() || '';

        if (!term || name.includes(term) || preview.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// ---------------------------
// Filter buttons (All/Unread/Meetings)
// ---------------------------
function initFilterButtons() {
    const buttons  = document.querySelectorAll('.filter-btn');
    const chatItem = document.querySelector('.chat-item');
    if (!buttons.length || !chatItem) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const label = btn.textContent.trim().toLowerCase();

            if (label === 'unread') {
                chatItem.style.display = chatItem.classList.contains('unread') ? 'flex' : 'none';
            } else if (label === 'meetings') {
                // Prototype: no meeting chats, so hide
                chatItem.style.display = 'none';
            } else {
                // "All" or anything else
                chatItem.style.display = 'flex';
            }
        });
    });
}

// ---------------------------
// Button popups (ALL buttons with title)
// ---------------------------
function initButtonPopups() {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const title = btn.getAttribute('title');
        if (!title) return;

        const [popupTitle, popupMsg] = getPopupTextFromTitle(title);
        showDemoPopup(popupTitle, popupMsg);
    });
}

function getPopupTextFromTitle(title) {
    const key = title.toLowerCase().trim();

    switch (key) {
        // Sidebar header
        case 'new chat':
            return [
                'New chat',
                'In a real client, this would open a people picker to start a new conversation.'
            ];
        case 'filter':
            return [
                'Filter chats',
                'This would open advanced filters for unread, mentions, meetings, and more.'
            ];
        case 'more options':
            return [
                'More chat options',
                'This would show pin, mute, hide, and notification settings for your chats.'
            ];

        // Chat filters
        case 'show all chats':
            return [
                'All chats',
                'Shows all conversations in your chat list.'
            ];
        case 'show only unread chats':
            return [
                'Unread chats',
                'Would filter the chat list to show only conversations with unread messages.'
            ];
        case 'show meeting-related chats':
            return [
                'Meeting chats',
                'Would filter to chats that are associated with meetings.'
            ];

        // Top bar in chat
        case 'video call':
            return [
                'Video call',
                'Would start a video meeting with Sarah directly from this chat.'
            ];
        case 'audio call':
            return [
                'Audio call',
                'Would start an audio-only call with Sarah.'
            ];
        case 'screen share':
            return [
                'Share screen',
                'Would let you share a window or your entire screen in a call.'
            ];
        case 'add people':
            return [
                'Add people',
                'Would let you turn this 1:1 chat into a group conversation by adding others.'
            ];

        // Compose header
        case 'format':
            return [
                'Format message',
                'Would open a rich text editor with headings, bullet lists, and more formatting tools.'
            ];
        case 'attach file':
            return [
                'Attach file',
                'Would open a file picker to attach files from your device or OneDrive.'
            ];
        case 'emoji':
            return [
                'Emoji picker',
                'Would open an emoji panel so you can insert emoji into your message.'
            ];
        case 'gif':
            return [
                'GIF picker',
                'Would open a GIF library to send reaction GIFs.'
            ];
        case 'sticker':
            return [
                'Stickers',
                'Would open a stickers drawer, including meme packs and custom stickers.'
            ];

        // Compose footer formatting
        case 'bold':
            return [
                'Bold text',
                'Would toggle bold formatting on the selected text.'
            ];
        case 'italic':
            return [
                'Italic text',
                'Would toggle italic formatting on the selected text.'
            ];
        case 'underline':
            return [
                'Underline text',
                'Would underline the selected portion of your message.'
            ];
        case 'link':
            return [
                'Insert link',
                'Would let you insert or edit a hyperlink in your message.'
            ];

        // Send
        case 'send message':
        case 'send':
            return [
                'Send message',
                'Sends the text you typed into the chat. Here it also triggers the prototype reply from Sarah.'
            ];

        default:
            return [
                'Prototype control',
                `In the full app, "${title}" would trigger its real Microsoft Teams feature.`
            ];
    }
}

function showDemoPopup(title, message) {
    if (!title)   title   = 'Prototype action';
    if (!message) message = 'This is a demo placeholder for this control.';

    let popup = document.querySelector('.demo-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.className = 'demo-popup';
        popup.innerHTML = `
            <div class="demo-popup-header">
                <span class="demo-popup-title"></span>
                <button class="demo-popup-close" aria-label="Close">&times;</button>
            </div>
            <div class="demo-popup-body"></div>
        `;
        document.body.appendChild(popup);

        // Basic inline styling so it always shows correctly
        Object.assign(popup.style, {
            position: 'fixed',
            right: '16px',
            bottom: '16px',
            maxWidth: '320px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: '#111827',
            color: '#f9fafb',
            fontSize: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'none'
        });

        const header = popup.querySelector('.demo-popup-header');
        Object.assign(header.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontWeight: '600'
        });

        const closeBtn = popup.querySelector('.demo-popup-close');
        Object.assign(closeBtn.style, {
            border: 'none',
            background: 'transparent',
            color: '#e5e7eb',
            cursor: 'pointer',
            fontSize: '14px',
            padding: 0,
            margin: 0
        });
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        const body = popup.querySelector('.demo-popup-body');
        body.style.marginTop = '2px';
        body.style.lineHeight = '1.4';
    }

    popup.querySelector('.demo-popup-title').textContent = title;
    popup.querySelector('.demo-popup-body').textContent  = message;
    popup.style.display = 'block';

    clearTimeout(popup._timer);
    popup._timer = setTimeout(() => {
        popup.style.display = 'none';
    }, 3500);
}

// ---------------------------
// Reactions (on messages)
// ---------------------------
function initReactionDelegation() {
    const container = document.getElementById('messages-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const reactionBtn = e.target.closest('.reaction');
        if (reactionBtn) {
            showDemoPopup(
                'Message reactions',
                'In a full client this would show who reacted and let you change your reaction.'
            );
        }
    });
}
