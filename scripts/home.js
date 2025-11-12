// Home Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHomeNavigation();
});

// Home Navigation
function initializeHomeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateFromHome(page);
        });
    });
}

// Navigate from home page
function navigateFromHome(page) {
    let targetPath = '';
    
    switch(page) {
        case 'teams':
            targetPath = 'pages/index.html';
            break;
        case 'chat':
            targetPath = 'pages/Chats/chat.html';
            break;
        case 'settings':
            targetPath = 'pages/settings/settings.html';
            break;
        case 'calendar':
        case 'calls':
        case 'files':
        case 'apps':
            alert(`${page.charAt(0).toUpperCase() + page.slice(1)} page coming soon!`);
            return;
    }
    
    if (targetPath) {
        window.location.href = targetPath;
    }
}

console.log('Home page initialized!');
