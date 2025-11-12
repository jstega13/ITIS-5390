
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsNav();
    initializeSettingsForms();
    initializeToggles();
});

// Settings Navigation
function initializeSettingsNav() {
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    
    settingsNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            settingsNavItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            const settingName = this.querySelector('span').textContent;
            updateSettingsContent(settingName);
        });
    });
}

// Update Settings Content
function updateSettingsContent(settingName) {
    const topBarTitle = document.querySelector('.channel-info h1');
    if (topBarTitle) {
        topBarTitle.textContent = settingName;
    }
    
    // In a real application, you would load different content based on the setting
    console.log(`Loading settings for: ${settingName}`);
}

// Settings Forms
function initializeSettingsForms() {
    const saveBtn = document.querySelector('.btn-primary');
    const cancelBtn = document.querySelector('.btn-secondary');
    const formInputs = document.querySelectorAll('.form-input:not([disabled]), .form-select');
    
    // Track changes
    let hasChanges = false;
    
    formInputs.forEach(input => {
        const originalValue = input.value;
        
        input.addEventListener('input', function() {
            hasChanges = this.value !== originalValue;
            updateSaveButton(hasChanges);
        });
    });
    
    // Save button
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveSettings();
        });
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (hasChanges) {
                if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                    resetForms();
                    hasChanges = false;
                    updateSaveButton(false);
                }
            }
        });
    }
}

// Update Save Button State
function updateSaveButton(enabled) {
    const saveBtn = document.querySelector('.btn-primary');
    if (saveBtn) {
        if (enabled) {
            saveBtn.style.opacity = '1';
            saveBtn.style.cursor = 'pointer';
        } else {
            saveBtn.style.opacity = '0.6';
            saveBtn.style.cursor = 'not-allowed';
        }
    }
}

// Save Settings
function saveSettings() {
    // Show loading state
    const saveBtn = document.querySelector('.btn-primary');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showMessage('Settings saved successfully!', 'success');
        
        // Reset button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        updateSaveButton(false);
    }, 1000);
}

// Reset Forms
function resetForms() {
    const formInputs = document.querySelectorAll('.form-input:not([disabled]), .form-select');
    formInputs.forEach(input => {
        // In a real app, you would reset to original values
        console.log('Resetting form');
    });
}

// Show Message Banner
function showMessage(message, type) {
    const settingsContent = document.querySelector('.settings-content');
    
    // Remove existing messages
    const existingMessage = document.querySelector('.message-banner');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageHTML = `
        <div class="message-banner ${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    settingsContent.insertAdjacentHTML('afterbegin', messageHTML);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const banner = document.querySelector('.message-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transition = 'opacity 0.3s';
            setTimeout(() => banner.remove(), 300);
        }
    }, 5000);
}

// Toggle Switches
function initializeToggles() {
    const toggleInputs = document.querySelectorAll('.toggle-switch input');
    
    toggleInputs.forEach(input => {
        input.addEventListener('change', function() {
            const toggleLabel = this.closest('.toggle-group').querySelector('.toggle-label').textContent;
            console.log(`${toggleLabel}: ${this.checked ? 'enabled' : 'disabled'}`);
            
            // In a real app, you would save this preference
        });
    });
}

// Change Photo
const changePhotoBtn = document.querySelector('.change-photo-btn');
if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', function() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const profileAvatar = document.querySelector('.profile-avatar-large');
                    if (profileAvatar) {
                        profileAvatar.src = event.target.result;
                        showMessage('Profile photo updated!', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
        fileInput.click();
    });
}

// Settings Action Buttons
const actionButtons = document.querySelectorAll('.settings-action-btn');
actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.textContent.trim();
        
        if (action.includes('Delete account')) {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                console.log('Account deletion requested');
                showMessage('Account deletion request submitted.', 'success');
            }
        } else if (action.includes('Change password')) {
            console.log('Opening change password dialog');
            showMessage('Password change feature coming soon!', 'success');
        } else if (action.includes('Two-factor')) {
            console.log('Opening 2FA setup');
            showMessage('Two-factor authentication setup coming soon!', 'success');
        } else if (action.includes('Download')) {
            console.log('Preparing data download');
            showMessage('Your data download will be ready shortly.', 'success');
        }
    });
});

// Search Settings
const settingsSearchInput = document.querySelector('.search-box input');
if (settingsSearchInput) {
    settingsSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const settingsNavItems = document.querySelectorAll('.settings-nav-item');
        const settingsSections = document.querySelectorAll('.settings-section');
        
        if (searchTerm === '') {
            // Show all items
            settingsNavItems.forEach(item => item.style.display = 'flex');
            settingsSections.forEach(section => section.style.display = 'block');
            return;
        }
        
        // Hide all sections first
        settingsSections.forEach(section => {
            const visibleItems = Array.from(section.querySelectorAll('.settings-nav-item')).filter(item => {
                const itemText = item.querySelector('span').textContent.toLowerCase();
                const matches = itemText.includes(searchTerm);
                item.style.display = matches ? 'flex' : 'none';
                return matches;
            });
            
            // Hide section if no visible items
            section.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.querySelector('.btn-primary');
        if (saveBtn && saveBtn.style.opacity !== '0.6') {
            saveSettings();
        }
    }
});

console.log('Settings functionality initialized!');
