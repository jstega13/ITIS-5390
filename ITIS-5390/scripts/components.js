// Universal Components Loader

// Determine the base path based on current location
function getBasePath() {
    const path = window.location.pathname;
    
    if (path.includes('/pages/Chats/')) {
        return '../../';
    } else if (path.includes('/pages/settings/')) {
        return '../../';
    } else if (path.includes('/pages/')) {
        return '../';
    } else {
        return './';
    }
}

// Load component HTML
async function loadComponent(componentName, targetId) {
    const basePath = getBasePath();
    const componentPath = `${basePath}components/${componentName}.html`;
    
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentName}`);
        
        const html = await response.text();
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = html;
        }
        
        return true;
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
        return false;
    }
}

// Initialize components
async function initializeComponents() {
    // Load topbar and sidebar
    await loadComponent('topbar', 'topbar-container');
    await loadComponent('sidebar', 'sidebar-container');
    
    // Set up navigation after components are loaded
    setupComponentNavigation();
    setActiveNavItem();
}

// Setup navigation for components
function setupComponentNavigation() {
    const basePath = getBasePath();
    
    // Setup home link
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.href = `${basePath}index.html`;
    }
    
    // Setup settings button in topbar
    const settingsBtn = document.getElementById('settings-link');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            navigateToPage('settings');
        });
    }
    
    // Setup sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

// Navigate to different pages
function navigateToPage(page) {
    const currentPath = window.location.pathname;
    const basePath = getBasePath();
    let targetPath = '';
    
    // Determine target path based on page
    switch(page) {
        case 'teams':
            targetPath = `${basePath}pages/teams.html`;
            break;
        case 'chat':
            targetPath = `${basePath}pages/Chats/chat.html`;
            break;
        case 'settings':
            targetPath = `${basePath}pages/settings/settings.html`;
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

// Set active nav item based on current page
function setActiveNavItem() {
    const path = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        
        const page = item.getAttribute('data-page');
        
        if ((path.includes('/pages/teams.html') || path.includes('/pages/index.html')) && page === 'teams') {
            item.classList.add('active');
        } else if (path.includes('/Chats/') && page === 'chat') {
            item.classList.add('active');
        } else if (path.includes('/settings/') && page === 'settings') {
            item.classList.add('active');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
    initializeComponents();
}
