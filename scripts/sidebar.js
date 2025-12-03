//deleted because whatever overcomplicated mess this was i didnt like. I embedded hrefs in the sidebar as thats all it needed. 
// use the components.js script to connect sidebar to your html page. 
// add embedded href tags for new pages in the sidebar.html -Ryan C

// User Status Popup Menu
document.addEventListener('DOMContentLoaded', function() {
    const avatarBtn = document.getElementById('user-avatar-btn');
    const statusPopup = document.getElementById('status-popup-menu');
    const statusIndicator = document.getElementById('user-status-indicator');
    const statusOptions = document.querySelectorAll('.status-option');

    // Load saved status from localStorage or default to 'available'
    let currentStatus = localStorage.getItem('userStatus') || 'available';
    updateStatusIndicator(currentStatus);

    // Toggle popup when avatar is clicked
    if (avatarBtn) {
        avatarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = statusPopup.style.display === 'block';
            statusPopup.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Handle status option clicks
    statusOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const status = this.getAttribute('data-status');
            currentStatus = status;
            localStorage.setItem('userStatus', status);
            updateStatusIndicator(status);
            statusPopup.style.display = 'none';
        });
    });

    // Close popup when clicking outside
    document.addEventListener('click', function(e) {
        if (statusPopup && !statusPopup.contains(e.target) && e.target !== avatarBtn) {
            statusPopup.style.display = 'none';
        }
    });

    function updateStatusIndicator(status) {
        if (!statusIndicator) return;
        
        // Remove all status classes
        statusIndicator.classList.remove('status-available', 'status-busy', 'status-away', 'status-offline');
        
        // Add the current status class
        statusIndicator.classList.add('status-' + status);
    }
});