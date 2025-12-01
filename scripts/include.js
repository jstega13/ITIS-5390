// Component Include System
// Loads HTML components using data-include attribute

(function() {
    'use strict';

    // Load all components with data-include attribute
    function loadIncludes() {
        const includes = document.querySelectorAll('[data-include]');
        
        includes.forEach(element => {
            const file = element.getAttribute('data-include');
            if (!file) return;
            
            // Create XMLHttpRequest for synchronous loading
            const xhr = new XMLHttpRequest();
            xhr.open('GET', file, true);
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        element.innerHTML = xhr.responseText;
                        element.removeAttribute('data-include');
                        
                        // After loading, initialize navigation
                        if (file.includes('topbar') || file.includes('sidebar')) {
                            initializeNavigation();
                        }
                    } else {
                        console.error(`Failed to load ${file}: ${xhr.status}`);
                    }
                }
            };
            
            xhr.send();
        });
    }

    // Initialize navigation after components are loaded
    function initializeNavigation() {
        // Wait a bit to ensure DOM is updated
        setTimeout(() => {
            setupNavigation();
            setActivePage();
        }, 50);
    }

    // Setup all navigation links
    function setupNavigation() {
    // Setup home link
    const homeLink = document.getElementById('home-link');
    if (homeLink && !homeLink.hasAttribute('data-nav-setup')) {
        homeLink.addEventListener('click', () => navigateToPage('home'));
        homeLink.setAttribute('data-nav-setup', 'true');
    }

    // Setup settings button
    const settingsBtn = document.getElementById('settings-link');
    if (settingsBtn && !settingsBtn.hasAttribute('data-nav-setup')) {
        settingsBtn.addEventListener('click', () => navigateToPage('settings'));
        settingsBtn.setAttribute('data-nav-setup', 'true');
    }

    // Setup all other nav items
    document.querySelectorAll('.nav-item:not([data-nav-setup])').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
        item.setAttribute('data-nav-setup', 'true');
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
            case 'home':
                targetPath = `${basePath}index.html`;
                break;
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
                targetPath = `${basePath}Files.html`;
                break;
            case 'apps':
                alert(`${page.charAt(0).toUpperCase() + page.slice(1)} page coming soon!`);
                return;
    }

        // Navigate
        if (targetPath) {
            window.location.href = targetPath;
        }
    }

    // Set active page indicator
    function setActivePage() {
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
        document.addEventListener('DOMContentLoaded', loadIncludes);
    } else {
        loadIncludes();
    }

})();
