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
        const basePath = getBasePath();
        
        // Setup home link
        const homeLink = document.getElementById('home-link');
        if (homeLink && !homeLink.hasAttribute('data-nav-setup')) {
            homeLink.href = `${basePath}index.html`;
            homeLink.setAttribute('data-nav-setup', 'true');
        }
        
        // Setup settings button
        const settingsBtn = document.getElementById('settings-link');
        if (settingsBtn && !settingsBtn.hasAttribute('data-nav-setup')) {
            settingsBtn.addEventListener('click', function() {
                navigateToPage('settings');
            });
            settingsBtn.setAttribute('data-nav-setup', 'true');
        }
        
        // Setup sidebar navigation items
        const navItems = document.querySelectorAll('.nav-item:not([data-nav-setup])');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const page = this.getAttribute('data-page');
                navigateToPage(page);
            });
            item.setAttribute('data-nav-setup', 'true');
        });
    }

    // Get base path based on current location
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

    // Navigate to different pages
    function navigateToPage(page) {
        const basePath = getBasePath();
        let targetPath = '';
        
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
