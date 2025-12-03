// Files Page JavaScript

// State management
let currentSection = 'recent';
let currentPath = ['Files', 'Recent'];
let selectedFiles = new Set();
let sortColumn = 'name';
let sortDirection = 'asc';

// File data structure
const fileDatabase = {
    recent: [
        { name: 'Design Documents', type: 'folder', modified: 'Yesterday', size: null, sharedBy: null, items: [] },
        { name: 'Marketing Assets', type: 'folder', modified: '3 days ago', size: null, sharedBy: null, items: [] },
        { name: 'Q4_Presentation.pptx', type: 'powerpoint', modified: '2 hours ago', size: '4.2 MB', sharedBy: 'Sarah Johnson' },
        { name: 'Budget_Report.xlsx', type: 'excel', modified: '5 hours ago', size: '1.8 MB', sharedBy: 'Michael Chen' },
        { name: 'Project_Proposal.docx', type: 'word', modified: 'Yesterday', size: '856 KB', sharedBy: 'Emily Rodriguez' },
        { name: 'meeting_notes.pdf', type: 'pdf', modified: '2 days ago', size: '324 KB', sharedBy: 'David Kim' },
        { name: 'wireframes.fig', type: 'figma', modified: '3 days ago', size: '2.4 MB', sharedBy: 'Emily Rodriguez' },
        { name: 'team_photo.jpg', type: 'image', modified: '1 week ago', size: '3.1 MB', sharedBy: 'Lisa Wang' },
        { name: 'data_analysis.csv', type: 'csv', modified: '1 week ago', size: '512 KB', sharedBy: 'Michael Chen' }
    ],
    teams: [
        { name: 'General', type: 'folder', modified: '1 day ago', size: null, sharedBy: null },
        { name: 'Design', type: 'folder', modified: '2 days ago', size: null, sharedBy: null },
        { name: 'Development', type: 'folder', modified: '3 days ago', size: null, sharedBy: null }
    ],
    onedrive: [
        { name: 'Personal Documents', type: 'folder', modified: 'Yesterday', size: null, sharedBy: null },
        { name: 'Photos', type: 'folder', modified: '1 week ago', size: null, sharedBy: null }
    ],
    downloads: [
        { name: 'setup.exe', type: 'file', modified: 'Today', size: '125 MB', sharedBy: null }
    ],
    shared: [
        { name: 'Shared_Report.docx', type: 'word', modified: 'Today', size: '1.2 MB', sharedBy: 'John Doe' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    initializeFilesNavigation();
    initializeViewToggle();
    initializeFileSelection();
    initializeFileActions();
    initializeSearch();
    initializeFolderNavigation();
    initializeSorting();
    initializeKeyboardShortcuts();
});

// Files Navigation
function initializeFilesNavigation() {
    const navItems = document.querySelectorAll('.files-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            const section = this.getAttribute('data-section');
            const team = this.getAttribute('data-team');
            
            if (section) {
                currentSection = section;
                currentPath = ['Files', getSectionName(section)];
                updateBreadcrumb();
                loadSection(section);
            } else if (team) {
                currentSection = team;
                currentPath = ['Files', getTeamName(team)];
                updateBreadcrumb();
                loadTeamFiles(team);
            }
        });
    });
}

function getSectionName(section) {
    const names = {
        'recent': 'Recent',
        'teams': 'Microsoft Teams',
        'onedrive': 'OneDrive',
        'downloads': 'Downloads',
        'shared': 'Shared with me'
    };
    return names[section] || section;
}

function getTeamName(team) {
    const names = {
        'innovatesync': 'InnovateSync',
        'projectmgmt': 'Project Management'
    };
    return names[team] || team;
}

// Update Breadcrumb
function updateBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    breadcrumb.innerHTML = currentPath.map((item, index) => {
        const isLast = index === currentPath.length - 1;
        const chevron = isLast ? '' : '<i class="fas fa-chevron-right"></i>';
        const activeClass = isLast ? 'active' : '';
        
        return `<span class="breadcrumb-item ${activeClass}" data-index="${index}">${item}</span>${chevron}`;
    }).join('');
    
    // Add click handlers to breadcrumb items
    breadcrumb.querySelectorAll('.breadcrumb-item:not(.active)').forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            navigateToBreadcrumb(index);
        });
    });
}

function navigateToBreadcrumb(index) {
    currentPath = currentPath.slice(0, index + 1);
    updateBreadcrumb();
    renderFileList(fileDatabase[currentSection] || []);
    showNotification(`Navigated to ${currentPath[currentPath.length - 1]}`);
}

// Load Section
function loadSection(section) {
    const files = fileDatabase[section] || [];
    renderFileList(files);
    clearSelection();
    showNotification(`Loaded ${getSectionName(section)}`);
}

// Load Team Files
function loadTeamFiles(team) {
    const files = fileDatabase.teams || [];
    renderFileList(files);
    clearSelection();
    showNotification(`Loaded ${getTeamName(team)} files`);
}

// Render File List
function renderFileList(files) {
    const filesList = document.querySelector('.files-list');
    if (!filesList) return;
    
    // Sort files
    const sortedFiles = sortFiles(files);
    
    filesList.innerHTML = '';
    
    if (sortedFiles.length === 0) {
        filesList.innerHTML = `
            <div class="files-empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No files here</h3>
                <p>Upload or create new files to get started</p>
                <button onclick="handleUpload()">Upload files</button>
            </div>
        `;
        return;
    }
    
    sortedFiles.forEach(file => {
        const fileItem = createFileElement(file);
        filesList.appendChild(fileItem);
    });
    
    // Reinitialize selection for new elements
    initializeFileSelection();
}

// Create File Element
function createFileElement(file) {
    const div = document.createElement('div');
    div.className = `file-item ${file.type === 'folder' ? 'folder' : ''}`;
    div.setAttribute('data-name', file.name);
    div.setAttribute('data-type', file.type);
    
    const icon = getFileIcon(file.type);
    const sizeDisplay = file.size || '—';
    const sharedDisplay = file.sharedBy || '—';
    
    div.innerHTML = `
        <div class="file-col-name">
            <input type="checkbox" class="file-checkbox">
            <i class="${icon}"></i>
            <span class="file-name">${file.name}</span>
        </div>
        <div class="file-col-modified">${file.modified}</div>
        <div class="file-col-size">${sizeDisplay}</div>
        <div class="file-col-shared">${sharedDisplay}</div>
        <button class="file-more-btn">
            <i class="fas fa-ellipsis-h"></i>
        </button>
    `;
    
    return div;
}

// Get File Icon
function getFileIcon(type) {
    const icons = {
        'folder': 'fas fa-folder file-icon',
        'powerpoint': 'fas fa-file-powerpoint file-icon powerpoint',
        'excel': 'fas fa-file-excel file-icon excel',
        'word': 'fas fa-file-word file-icon word',
        'pdf': 'fas fa-file-pdf file-icon pdf',
        'image': 'fas fa-file-image file-icon image',
        'csv': 'fas fa-file-csv file-icon csv',
        'figma': 'fas fa-file file-icon figma',
        'file': 'fas fa-file file-icon'
    };
    return icons[type] || icons.file;
}

// View Toggle (Grid/List)
function initializeViewToggle() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const filesContainer = document.querySelector('.files-container');
    
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Remove active class from all toggles
            viewToggles.forEach(t => t.classList.remove('active'));
            // Add active class to clicked toggle
            this.classList.add('active');
            
            // Update container view
            if (view === 'grid') {
                filesContainer.classList.remove('list-view');
                filesContainer.classList.add('grid-view');
                showNotification('Switched to grid view');
            } else {
                filesContainer.classList.remove('grid-view');
                filesContainer.classList.add('list-view');
                showNotification('Switched to list view');
            }
        });
    });
}

// File Selection
function initializeFileSelection() {
    const selectAllCheckbox = document.getElementById('select-all');
    const fileCheckboxes = document.querySelectorAll('.file-checkbox');
    
    // Select All
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            fileCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                const fileName = checkbox.closest('.file-item').getAttribute('data-name');
                if (this.checked) {
                    selectedFiles.add(fileName);
                } else {
                    selectedFiles.delete(fileName);
                }
                updateFileSelection(checkbox);
            });
            updateActionButtons();
        });
    }
    
    // Individual file selection
    fileCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            e.stopPropagation();
            const fileName = this.closest('.file-item').getAttribute('data-name');
            if (this.checked) {
                selectedFiles.add(fileName);
            } else {
                selectedFiles.delete(fileName);
            }
            updateFileSelection(this);
            updateActionButtons();
            updateSelectAll();
        });
    });
    
    // Click on file item
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on checkbox or more button
            if (e.target.closest('.file-checkbox') || e.target.closest('.file-more-btn')) {
                return;
            }
            
            const fileName = this.getAttribute('data-name');
            openFile(fileName, this.classList.contains('folder'));
        });
        
        // Right-click context menu
        item.addEventListener('contextmenu', function(e) {
            const fileName = this.getAttribute('data-name');
            showFileContextMenu(e, fileName);
        });
    });
    
    // More buttons
    const moreButtons = document.querySelectorAll('.file-more-btn');
    moreButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const fileItem = this.closest('.file-item');
            const fileName = fileItem.getAttribute('data-name');
            
            // Create click event with button position
            const rect = this.getBoundingClientRect();
            const clickEvent = {
                pageX: rect.left,
                pageY: rect.bottom + 5,
                preventDefault: () => {}
            };
            
            showFileContextMenu(clickEvent, fileName);
        });
    });
}

// Update File Selection Visual
function updateFileSelection(checkbox) {
    const fileItem = checkbox.closest('.file-item');
    if (checkbox.checked) {
        fileItem.classList.add('selected');
    } else {
        fileItem.classList.remove('selected');
    }
}

// Update Select All Checkbox
function updateSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const fileCheckboxes = document.querySelectorAll('.file-checkbox');
    
    if (selectAllCheckbox) {
        const allChecked = Array.from(fileCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(fileCheckboxes).some(cb => cb.checked);
        
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }
}

// Update Action Buttons
function updateActionButtons() {
    const selectedFiles = document.querySelectorAll('.file-checkbox:checked');
    const shareBtn = document.querySelector('.action-btn:has(.fa-share)');
    const downloadBtn = document.querySelector('.action-btn:has(.fa-download)');
    const deleteBtn = document.querySelector('.action-btn:has(.fa-trash)');
    
    const hasSelection = selectedFiles.length > 0;
    
    if (shareBtn) shareBtn.disabled = !hasSelection;
    if (downloadBtn) downloadBtn.disabled = !hasSelection;
    if (deleteBtn) deleteBtn.disabled = !hasSelection;
}

// Open File
function openFile(fileName, isFolder) {
    if (isFolder) {
        console.log(`Opening folder: ${fileName}`);
        // In a real app, navigate into the folder
        showNotification(`Opening folder: ${fileName}`);
    } else {
        console.log(`Opening file: ${fileName}`);
        // In a real app, open the file for preview/editing
        showNotification(`Opening file: ${fileName}`);
    }
}

// File Actions
function initializeFileActions() {
    const newFileBtn = document.getElementById('new-file-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const shareBtn = document.querySelector('.action-btn:has(.fa-share)');
    const downloadBtn = document.querySelector('.action-btn:has(.fa-download)');
    const deleteBtn = document.querySelector('.action-btn:has(.fa-trash)');
    
    if (newFileBtn) {
        newFileBtn.addEventListener('click', showNewFileMenu);
    }
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleUpload);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDelete);
    }
    
    // More buttons on file items
    const moreButtons = document.querySelectorAll('.file-more-btn');
    moreButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const fileItem = this.closest('.file-item');
            const fileName = fileItem.getAttribute('data-name');
            showFileContextMenu(e, fileName);
        });
    });
}

// Show New File Menu
function showNewFileMenu() {
    const menu = createContextMenu([
        { icon: 'fa-file-word', text: 'Word document', action: () => createNewFile('word') },
        { icon: 'fa-file-excel', text: 'Excel workbook', action: () => createNewFile('excel') },
        { icon: 'fa-file-powerpoint', text: 'PowerPoint presentation', action: () => createNewFile('powerpoint') },
        { divider: true },
        { icon: 'fa-folder', text: 'Folder', action: () => createNewFolder() },
        { divider: true },
        { icon: 'fa-upload', text: 'Upload files', action: () => handleUpload() }
    ]);
    
    const btn = document.getElementById('new-file-btn');
    const rect = btn.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

function createNewFile(type) {
    const fileName = prompt(`Enter name for new ${type} file:`);
    if (!fileName) return;
    
    const extensions = {
        'word': '.docx',
        'excel': '.xlsx',
        'powerpoint': '.pptx'
    };
    
    const fullName = fileName.includes('.') ? fileName : fileName + extensions[type];
    
    const newFile = {
        name: fullName,
        type: type,
        modified: 'Just now',
        size: '0 KB',
        sharedBy: 'You'
    };
    
    fileDatabase[currentSection].unshift(newFile);
    renderFileList(fileDatabase[currentSection]);
    showNotification(`Created ${fullName}`);
}

function createNewFolder() {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    
    const newFolder = {
        name: folderName,
        type: 'folder',
        modified: 'Just now',
        size: null,
        sharedBy: null,
        items: []
    };
    
    fileDatabase[currentSection].unshift(newFolder);
    renderFileList(fileDatabase[currentSection]);
    showNotification(`Created folder: ${folderName}`);
}

// Handle Upload
function handleUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            uploadFiles(files);
        }
    });
    
    fileInput.click();
}

function uploadFiles(files) {
    let uploaded = 0;
    const total = files.length;
    
    showNotification(`Uploading ${total} file(s)...`);
    
    files.forEach((file, index) => {
        // Simulate upload delay
        setTimeout(() => {
            const newFile = {
                name: file.name,
                type: getFileType(file.name),
                modified: 'Just now',
                size: formatFileSize(file.size),
                sharedBy: 'You'
            };
            
            fileDatabase[currentSection].unshift(newFile);
            uploaded++;
            
            if (uploaded === total) {
                renderFileList(fileDatabase[currentSection]);
                showNotification(`Successfully uploaded ${total} file(s)`);
            }
        }, index * 500);
    });
}

function getFileType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const typeMap = {
        'docx': 'word',
        'doc': 'word',
        'xlsx': 'excel',
        'xls': 'excel',
        'pptx': 'powerpoint',
        'ppt': 'powerpoint',
        'pdf': 'pdf',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image',
        'csv': 'csv',
        'fig': 'figma'
    };
    return typeMap[ext] || 'file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Handle Share
function handleShare() {
    const selected = getSelectedFiles();
    if (selected.length === 0) return;
    
    const shareDialog = createShareDialog(selected);
    document.body.appendChild(shareDialog);
}

function createShareDialog(files) {
    const dialog = document.createElement('div');
    dialog.className = 'share-dialog-overlay';
    dialog.innerHTML = `
        <div class="share-dialog">
            <div class="share-dialog-header">
                <h2>Share ${files.length} item(s)</h2>
                <button class="close-dialog">&times;</button>
            </div>
            <div class="share-dialog-content">
                <label>Share with:</label>
                <input type="text" class="share-input" placeholder="Enter name or email">
                <div class="share-permissions">
                    <label>
                        <input type="radio" name="permission" value="view" checked>
                        Can view
                    </label>
                    <label>
                        <input type="radio" name="permission" value="edit">
                        Can edit
                    </label>
                </div>
                <div class="share-link-section">
                    <h3>Or share via link</h3>
                    <div class="link-controls">
                        <input type="text" class="share-link-input" value="https://teams.microsoft.com/share/abc123" readonly>
                        <button class="copy-link-btn">Copy</button>
                    </div>
                </div>
            </div>
            <div class="share-dialog-footer">
                <button class="btn-secondary cancel-share">Cancel</button>
                <button class="btn-primary confirm-share">Share</button>
            </div>
        </div>
    `;
    
    // Event listeners
    dialog.querySelector('.close-dialog').onclick = () => dialog.remove();
    dialog.querySelector('.cancel-share').onclick = () => dialog.remove();
    dialog.querySelector('.confirm-share').onclick = () => {
        const email = dialog.querySelector('.share-input').value;
        if (email) {
            showNotification(`Shared ${files.length} item(s) with ${email}`);
            dialog.remove();
        } else {
            alert('Please enter an email address');
        }
    };
    dialog.querySelector('.copy-link-btn').onclick = () => {
        const linkInput = dialog.querySelector('.share-link-input');
        linkInput.select();
        document.execCommand('copy');
        showNotification('Link copied to clipboard');
    };
    
    // Close on overlay click
    dialog.onclick = (e) => {
        if (e.target === dialog) dialog.remove();
    };
    
    return dialog;
}

// Handle Download
function handleDownload() {
    const selected = getSelectedFiles();
    if (selected.length === 0) return;
    
    // Show download progress
    const progressDialog = createProgressDialog('Downloading', selected.length);
    document.body.appendChild(progressDialog);
    
    let downloaded = 0;
    const progressBar = progressDialog.querySelector('.progress-fill');
    const progressText = progressDialog.querySelector('.progress-text');
    
    const interval = setInterval(() => {
        downloaded += 10;
        const percent = Math.min(downloaded, 100);
        progressBar.style.width = percent + '%';
        progressText.textContent = `${percent}%`;
        
        if (downloaded >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progressDialog.remove();
                showNotification(`Successfully downloaded ${selected.length} item(s)`);
            }, 500);
        }
    }, 100);
}

function createProgressDialog(action, count) {
    const dialog = document.createElement('div');
    dialog.className = 'progress-dialog-overlay';
    dialog.innerHTML = `
        <div class="progress-dialog">
            <h3>${action} ${count} item(s)...</h3>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">0%</div>
        </div>
    `;
    return dialog;
}

// Handle Delete
function handleDelete() {
    const selected = getSelectedFiles();
    if (selected.length === 0) return;
    
    const confirmDialog = createConfirmDialog(
        'Delete items?',
        `Are you sure you want to delete ${selected.length} item(s)? This action cannot be undone.`,
        () => {
            // Remove from database
            fileDatabase[currentSection] = fileDatabase[currentSection].filter(
                file => !selected.find(s => s.name === file.name)
            );
            
            // Animate removal
            const selectedItems = document.querySelectorAll('.file-item.selected');
            selectedItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    item.style.transition = 'all 0.3s';
                }, index * 50);
            });
            
            setTimeout(() => {
                renderFileList(fileDatabase[currentSection]);
                clearSelection();
                showNotification(`Deleted ${selected.length} item(s)`);
            }, selected.length * 50 + 300);
        }
    );
    
    document.body.appendChild(confirmDialog);
}

function createConfirmDialog(title, message, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog-overlay';
    dialog.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-dialog-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>${title}</h2>
            </div>
            <div class="confirm-dialog-content">
                <p>${message}</p>
            </div>
            <div class="confirm-dialog-footer">
                <button class="btn-secondary cancel-btn">Cancel</button>
                <button class="btn-danger confirm-btn">Delete</button>
            </div>
        </div>
    `;
    
    dialog.querySelector('.cancel-btn').onclick = () => dialog.remove();
    dialog.querySelector('.confirm-btn').onclick = () => {
        onConfirm();
        dialog.remove();
    };
    dialog.onclick = (e) => {
        if (e.target === dialog) dialog.remove();
    };
    
    return dialog;
}

// Get Selected File Names
function getSelectedFileNames() {
    return Array.from(selectedFiles);
}

function getSelectedFiles() {
    return fileDatabase[currentSection].filter(file => selectedFiles.has(file.name));
}

function clearSelection() {
    selectedFiles.clear();
    document.querySelectorAll('.file-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.file-item').forEach(item => item.classList.remove('selected'));
    updateActionButtons();
    updateSelectAll();
}

// Show File Context Menu
function showFileContextMenu(e, fileName) {
    e.preventDefault();
    
    const file = fileDatabase[currentSection].find(f => f.name === fileName);
    const isFolder = file && file.type === 'folder';
    
    const menuItems = [
        { icon: 'fa-folder-open', text: 'Open', action: () => openFile(fileName, isFolder) },
        { icon: 'fa-download', text: 'Download', action: () => downloadSingleFile(fileName) },
        { divider: true },
        { icon: 'fa-share', text: 'Share', action: () => shareSingleFile(fileName) },
        { icon: 'fa-link', text: 'Copy link', action: () => copyFileLink(fileName) },
        { divider: true },
        { icon: 'fa-edit', text: 'Rename', action: () => renameFile(fileName) },
        { icon: 'fa-copy', text: 'Make a copy', action: () => copyFile(fileName) },
        { divider: true },
        { icon: 'fa-trash', text: 'Delete', action: () => deleteSingleFile(fileName), className: 'danger' }
    ];
    
    const menu = createContextMenu(menuItems);
    menu.style.top = `${e.pageY}px`;
    menu.style.left = `${e.pageX}px`;
    
    document.body.appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

function createContextMenu(items) {
    const menu = document.createElement('div');
    menu.className = 'context-menu active';
    
    items.forEach(item => {
        if (item.divider) {
            menu.innerHTML += '<div class="context-menu-divider"></div>';
        } else {
            const menuItem = document.createElement('div');
            menuItem.className = `context-menu-item ${item.className || ''}`;
            menuItem.innerHTML = `<i class="fas ${item.icon}"></i><span>${item.text}</span>`;
            menuItem.onclick = () => {
                item.action();
                menu.remove();
            };
            menu.appendChild(menuItem);
        }
    });
    
    return menu;
}

function downloadSingleFile(fileName) {
    selectedFiles.clear();
    selectedFiles.add(fileName);
    handleDownload();
}

function shareSingleFile(fileName) {
    selectedFiles.clear();
    selectedFiles.add(fileName);
    handleShare();
}

function copyFileLink(fileName) {
    const link = `https://teams.microsoft.com/files/${encodeURIComponent(fileName)}`;
    navigator.clipboard.writeText(link).then(() => {
        showNotification('Link copied to clipboard');
    });
}

function renameFile(oldName) {
    const newName = prompt('Enter new name:', oldName);
    if (!newName || newName === oldName) return;
    
    const file = fileDatabase[currentSection].find(f => f.name === oldName);
    if (file) {
        file.name = newName;
        renderFileList(fileDatabase[currentSection]);
        showNotification(`Renamed to ${newName}`);
    }
}

function copyFile(fileName) {
    const file = fileDatabase[currentSection].find(f => f.name === fileName);
    if (!file) return;
    
    const ext = fileName.includes('.') ? fileName.split('.').pop() : '';
    const baseName = ext ? fileName.replace(`.${ext}`, '') : fileName;
    const copyName = ext ? `${baseName} (copy).${ext}` : `${fileName} (copy)`;
    
    const copy = { ...file, name: copyName, modified: 'Just now' };
    fileDatabase[currentSection].unshift(copy);
    renderFileList(fileDatabase[currentSection]);
    showNotification(`Created copy: ${copyName}`);
}

function deleteSingleFile(fileName) {
    selectedFiles.clear();
    selectedFiles.add(fileName);
    handleDelete();
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('file-search');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                filterFiles(searchTerm);
            }, 300);
        });
    }
}

// Filter Files
function filterFiles(searchTerm) {
    const fileItems = document.querySelectorAll('.file-item');
    let visibleCount = 0;
    
    fileItems.forEach(item => {
        const fileName = item.getAttribute('data-name').toLowerCase();
        const fileType = item.getAttribute('data-type').toLowerCase();
        
        if (fileName.includes(searchTerm) || fileType.includes(searchTerm)) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    if (searchTerm && visibleCount === 0) {
        const filesList = document.querySelector('.files-list');
        if (!document.querySelector('.no-results')) {
            const noResults = document.createElement('div');
            noResults.className = 'files-empty-state no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No files found</h3>
                <p>Try adjusting your search terms</p>
            `;
            filesList.appendChild(noResults);
        }
    } else {
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();
    }
}

// Folder Navigation
function initializeFolderNavigation() {
    // Already handled in initializeFileSelection through openFile
}

// Open File
function openFile(fileName, isFolder) {
    if (isFolder) {
        currentPath.push(fileName);
        updateBreadcrumb();
        
        // Simulate folder contents
        const folderContents = [
            { name: 'Document1.docx', type: 'word', modified: '1 hour ago', size: '245 KB', sharedBy: 'You' },
            { name: 'Spreadsheet.xlsx', type: 'excel', modified: '2 hours ago', size: '128 KB', sharedBy: 'You' }
        ];
        
        renderFileList(folderContents);
        showNotification(`Opened folder: ${fileName}`);
    } else {
        // Show file preview dialog
        const file = fileDatabase[currentSection].find(f => f.name === fileName);
        if (file) {
            showFilePreview(file);
        }
    }
}

function showFilePreview(file) {
    const preview = document.createElement('div');
    preview.className = 'file-preview-overlay';
    preview.innerHTML = `
        <div class="file-preview-dialog">
            <div class="file-preview-header">
                <h2>${file.name}</h2>
                <button class="close-preview">&times;</button>
            </div>
            <div class="file-preview-content">
                <div class="file-preview-icon">
                    <i class="${getFileIcon(file.type)}"></i>
                </div>
                <div class="file-preview-info">
                    <div class="info-row">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${file.type}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Size:</span>
                        <span class="info-value">${file.size || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Modified:</span>
                        <span class="info-value">${file.modified}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Shared by:</span>
                        <span class="info-value">${file.sharedBy || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="file-preview-footer">
                <button class="btn-secondary" onclick="this.closest('.file-preview-overlay').remove()">Close</button>
                <button class="btn-primary" onclick="downloadSingleFile('${file.name}'); this.closest('.file-preview-overlay').remove();">Download</button>
            </div>
        </div>
    `;
    
    preview.querySelector('.close-preview').onclick = () => preview.remove();
    preview.onclick = (e) => {
        if (e.target === preview) preview.remove();
    };
    
    document.body.appendChild(preview);
}

// Show Notification
function showNotification(message) {
    // Check if notification already exists
    let notification = document.querySelector('.file-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'file-notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--teams-purple);
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInUp 0.3s ease-out;
    `;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Drag and Drop (basic implementation)
const filesContainer = document.querySelector('.files-container');

if (filesContainer) {
    filesContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-active');
    });
    
    filesContainer.addEventListener('dragleave', function(e) {
        if (e.target === this) {
            this.classList.remove('drag-active');
        }
    });
    
    filesContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-active');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            uploadFiles(files);
        }
    });
}

// Sorting
function initializeSorting() {
    const headers = document.querySelectorAll('.file-list-header > div');
    
    headers.forEach(header => {
        if (!header.querySelector('input[type="checkbox"]')) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const column = this.className.replace('file-col-', '');
                toggleSort(column);
            });
        }
    });
}

function toggleSort(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    renderFileList(fileDatabase[currentSection]);
    showNotification(`Sorted by ${column} (${sortDirection})`);
}

function sortFiles(files) {
    const sorted = [...files];
    
    sorted.sort((a, b) => {
        // Folders always come first
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        
        let aVal, bVal;
        
        switch(sortColumn) {
            case 'name':
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
                break;
            case 'modified':
                aVal = parseModified(a.modified);
                bVal = parseModified(b.modified);
                break;
            case 'size':
                aVal = parseSize(a.size);
                bVal = parseSize(b.size);
                break;
            case 'shared':
                aVal = a.sharedBy || '';
                bVal = b.sharedBy || '';
                break;
            default:
                return 0;
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    return sorted;
}

function parseModified(modified) {
    const now = Date.now();
    if (modified === 'Just now') return now;
    if (modified === 'Today') return now - 1000;
    if (modified.includes('hour')) return now - parseInt(modified) * 3600000;
    if (modified === 'Yesterday') return now - 86400000;
    if (modified.includes('day')) return now - parseInt(modified) * 86400000;
    if (modified.includes('week')) return now - parseInt(modified) * 604800000;
    return 0;
}

function parseSize(size) {
    if (!size || size === '—') return 0;
    const units = { 'Bytes': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824 };
    const match = size.match(/([\d.]+)\s*(\w+)/);
    if (!match) return 0;
    return parseFloat(match[1]) * (units[match[2]] || 1);
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + A - Select All
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const selectAll = document.getElementById('select-all');
            if (selectAll) {
                selectAll.checked = true;
                selectAll.dispatchEvent(new Event('change'));
            }
        }
        
        // Delete - Delete selected
        if (e.key === 'Delete' && selectedFiles.size > 0) {
            e.preventDefault();
            handleDelete();
        }
        
        // Ctrl/Cmd + D - Download
        if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedFiles.size > 0) {
            e.preventDefault();
            handleDownload();
        }
        
        // Escape - Clear selection
        if (e.key === 'Escape') {
            clearSelection();
        }
        
        // Ctrl/Cmd + F - Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('file-search')?.focus();
        }
    });
}