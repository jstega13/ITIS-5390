# InnovateSync - Microsoft Teams UI Clone

A pixel-perfect recreation of Microsoft Teams user interface built with HTML, CSS, and vanilla JavaScript.

## 🎨 Features

- **Authentic Microsoft Teams Design**: Closely mimics the look and feel of Microsoft Teams
- **Multiple Pages**: Teams, Chat, and Settings pages
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Components**: 
  - Navigation rail with active states
  - Expandable team channels
  - Real-time message sending
  - Chat conversations with typing indicators
  - Settings with form controls and toggles
  - Search functionality
  - Reaction buttons
  - Status indicators

## 📁 Project Structure

```
ITIS-5390/
├── pages/
│   ├── index.html              # Main Teams page
│   ├── Chats/
│   │   └── chat.html          # Chat/messaging page
│   └── settings/
│       └── settings.html      # Settings page
├── styles/
│   ├── styles.css             # Main stylesheet
│   ├── chat.css               # Chat-specific styles
│   └── settings.css           # Settings-specific styles
├── scripts/
│   ├── main.js                # Main JavaScript
│   ├── chat.js                # Chat functionality
│   └── settings.js            # Settings functionality
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No build tools or dependencies required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ITIS-5390.git
cd ITIS-5390
```

2. Open any HTML file in your browser:
   - `pages/index.html` - Teams page
   - `pages/Chats/chat.html` - Chat page
   - `pages/settings/settings.html` - Settings page

Or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then navigate to `http://localhost:8000/pages/index.html`

## 🎯 Pages Overview

### Teams Page (`index.html`)
- Left navigation rail with app icons
- Team and channel list sidebar
- Main content area with posts/messages
- Channel tabs (Posts, Files, Notes)
- Message composition box
- Reactions and interactions

### Chat Page (`chat.html`)
- Chat list with online status indicators
- One-on-one and group conversations
- Real-time typing indicators
- Message sending and receiving
- Unread message badges
- Search and filter functionality

### Settings Page (`settings.html`)
- Settings navigation sidebar
- Profile management
- Account settings
- Toggle switches for preferences
- Form inputs and controls
- Action buttons

## 🎨 Design Features

### Color Scheme
- Primary Purple: `#6264a7`
- Teams Blue: `#0078d4`
- Background: `#f3f2f1`
- White: `#ffffff`
- Gray variations for text and borders

### Typography
- Font Family: Segoe UI, system fonts
- Responsive font sizes
- Proper hierarchy and spacing

### Components
- Custom toggle switches
- Styled form inputs
- Icon buttons with hover states
- Message bubbles
- Status indicators
- Navigation items with active states

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search
- `Ctrl/Cmd + Shift + M` - Focus message compose
- `Ctrl/Cmd + Enter` - Send message (Teams page)
- `Enter` - Send message (Chat page)
- `Shift + Enter` - New line in message
- `Ctrl/Cmd + S` - Save settings

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `styles/styles.css`:
```css
:root {
    --teams-purple: #6264a7;
    --teams-blue: #0078d4;
    /* ... other variables */
}
```

### Adding New Teams/Channels
Edit the HTML in `pages/index.html` within the `.teams-list` section.

### Adding New Chat Conversations
Edit the HTML in `pages/Chats/chat.html` within the `.chats-list` section.

## 📱 Responsive Design

The interface adapts to different screen sizes:
- **Desktop** (>1024px): Full layout with all sidebars
- **Tablet** (768px-1024px): Adjusted sidebar widths
- **Mobile** (<768px): Collapsible sidebars, optimized touch targets

## 🌟 Interactive Features

### Message Sending
- Type in the compose box and click Send or press Enter
- Messages appear in real-time
- Auto-scroll to latest message

### Reactions
- Click reaction buttons to toggle
- Add new reactions with the emoji button
- Visual feedback on interaction

### Team/Channel Navigation
- Click teams to expand/collapse channels
- Click channels to switch views
- Active states show current selection

### Chat Features
- Click chat items to open conversations
- Typing indicators show activity
- Simulated responses for demo purposes
- Status indicators (online, away, busy, offline)

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Vanilla JS for interactivity
- **Font Awesome**: Icons
- **UI Avatars API**: Dynamic avatar generation

## 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a student project for ITIS-5390. Feel free to fork and experiment!

## 📄 License

This project is for educational purposes only. Microsoft Teams and its design are trademarks of Microsoft Corporation.

## 👨‍💻 Author

Created as part of ITIS-5390 coursework.

## 🙏 Acknowledgments

- Microsoft Teams for design inspiration
- Font Awesome for icons
- UI Avatars for avatar generation

## 📸 Screenshots

### Teams Page
The main Teams interface with channels, posts, and message composition.

### Chat Page
One-on-one and group messaging with real-time features.

### Settings Page
Comprehensive settings with profile management and preferences.

---

**Note**: This is a UI clone for educational purposes and does not include backend functionality or real-time communication features. It demonstrates front-end development skills and attention to design detail.
