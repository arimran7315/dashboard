tailwind.config = {
    darkMode: 'class'
}

// Toggle sidebar
const toggleSidebar = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const openIcon = toggleSidebar.querySelector('.sidebar-open');
const closeIcon = toggleSidebar.querySelector('.sidebar-close');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const logoText = document.getElementById('logo-text');
const menuTitle = document.getElementById('menu-title');
const secondaryTitle = document.getElementById('secondary-title');
const logo = document.getElementById('logo');
const footer_profile = document.getElementById('footer-profile');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

// Users collapsible submenu
const usersToggle = document.getElementById('users-toggle');
const usersItems = document.getElementById('users-items');
const collapsedIcon = document.getElementById('collapsed-icon')
// Function to toggle sidebar
function toggleSidebarState() {
    sidebar.classList.toggle('sidebar-collapsed');
    sidebar.classList.toggle('sidebar-expanded');

    // Toggle text elements in sidebar
    sidebarItems.forEach(item => {
        item.classList.toggle('hidden');
    });

    logoText.classList.toggle('hidden');
    menuTitle.classList.toggle('hidden');
    secondaryTitle.classList.toggle('hidden');

    // Change icon
    if (sidebar.classList.contains('sidebar-collapsed')) {
        logo.classList.remove('space-x-3');
        footer_profile.classList.remove('space-x-3');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        sidebarLinks.forEach(link => {
            link.classList.remove('space-x-3');
        });
        // Collapse users submenu when sidebar is collapsed
        usersItems.classList.add('hidden');
        usersToggle.querySelector('.users-icon').classList.add('fa-chevron-down');
        usersToggle.querySelector('.users-icon').classList.remove('fa-chevron-up');
        collapsedIcon.classList.add('hidden');
    } else {
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        logo.classList.add('space-x-3');
        footer_profile.classList.add('space-x-3');
        sidebarLinks.forEach(link => {
            link.classList.add('space-x-3');
        });
        collapsedIcon.classList.remove('hidden');
    }

    // Save state to localStorage
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('sidebar-collapsed'));
}

// Toggle Users submenu
usersToggle.addEventListener('click', () => {
    if (!sidebar.classList.contains('sidebar-collapsed')) {
        usersItems.classList.toggle('hidden');
        const icon = usersToggle.querySelector('.users-icon');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
        localStorage.setItem('usersCollapsed', usersItems.classList.contains('hidden'));
    }
});

// Initialize users submenu state
if (localStorage.getItem('usersCollapsed') === 'true') {
    usersItems.classList.add('hidden');
    usersToggle.querySelector('.users-icon').classList.add('fa-chevron-down');
    usersToggle.querySelector('.users-icon').classList.remove('fa-chevron-up');
}

toggleSidebar.addEventListener('click', toggleSidebarState);

// Check for saved sidebar state
if (localStorage.getItem('sidebarCollapsed') === 'true') {
    toggleSidebarState(); // Collapse if saved state is collapsed
}

// User dropdown menu
const userMenuButton = document.getElementById('user-menu-button');
const userMenu = document.getElementById('user-menu');

userMenuButton.addEventListener('click', () => {
    userMenu.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.add('hidden');
    }
});

// Highlight active sidebar link
sidebarLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove('active-sidebar-link'));
        this.classList.add('active-sidebar-link');
    });
});

function setupModal(modalId) {
    const modal = document.getElementById(modalId);
    const closeButtons = modal.querySelectorAll('.close-modal, .close-btn');
    const openButtons = document.querySelectorAll(`.open-modal[data-modal="${modalId}"]`);

    // Open modal
    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    });

    // Close modal
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// Initialize modals
document.querySelectorAll('.modal').forEach(modal => {
    setupModal(modal.id);
});

// File Upload Handling
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-upload');
const uploadProgress = document.getElementById('upload-progress');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const uploadedFiles = document.getElementById('uploaded-files');
const filesList = document.getElementById('files-list');

if(dropZone){
    // Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

// Handle selected files
fileInput.addEventListener('change', handleFiles);

}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropZone.classList.add('highlight');
}

function unhighlight() {
    dropZone.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files } });
}

function handleFiles(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    // Show progress bar
    uploadProgress.classList.remove('hidden');

    // Simulate upload progress (in a real app, you would use AJAX/Fetch)
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Upload complete - show files
            setTimeout(() => {
                uploadProgress.classList.add('hidden');
                showUploadedFiles(files);
            }, 500);
        }

        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;
    }, 200);
}

function showUploadedFiles(files) {
    dropZone.classList.add('hidden');
    filesList.innerHTML = '';

    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileType = getFileType(file.name);
        const fileSize = formatFileSize(file.size);

        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="fas ${getFileIcon(fileType)}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
            <div class="file-remove" title="Remove file">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer">
                    <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
            </div>
        `;

        // Add remove functionality
        const removeBtn = fileItem.querySelector('.file-remove');
        removeBtn.addEventListener('click', () => {
            dropZone.classList.remove('hidden');
            fileItem.remove();
            if (filesList.children.length === 0) {
                uploadedFiles.classList.add('hidden');
            }
        });

        filesList.appendChild(fileItem);
    });

    uploadedFiles.classList.remove('hidden');
}

function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const docTypes = ['doc', 'docx', 'txt', 'rtf'];
    const pdfTypes = ['pdf'];
    const spreadsheetTypes = ['xls', 'xlsx', 'csv'];

    if (imageTypes.includes(extension)) return 'image';
    if (docTypes.includes(extension)) return 'document';
    if (pdfTypes.includes(extension)) return 'pdf';
    if (spreadsheetTypes.includes(extension)) return 'spreadsheet';
    return 'file';
}

function getFileIcon(type) {
    const icons = {
        'image': 'fa-file-image',
        'document': 'fa-file-word',
        'pdf': 'fa-file-pdf',
        'spreadsheet': 'fa-file-excel',
        'file': 'fa-file-alt'
    };
    return icons[type] || 'fa-file-alt';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


// Dark mode toggle function
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    // Toggle the class
    html.classList.toggle('dark');

    // Save preference to localStorage
    localStorage.setItem('darkMode', isDark ? 'disabled' : 'enabled');

    // Update icons
    updateDarkModeIcons(!isDark);
}

// Function to update dark mode icons
function updateDarkModeIcons(isDark) {
    const moonIcons = document.querySelectorAll('.moon');
    const sunIcons = document.querySelectorAll('.sun');

    moonIcons.forEach(icon => {
        if (isDark) {
            icon.classList.add('hidden');
        } else {
            icon.classList.remove('hidden');
        }
    });

    sunIcons.forEach(icon => {
        if (isDark) {
            icon.classList.remove('hidden');
        } else {
            icon.classList.add('hidden');
        }
    });
}

// Initialize dark mode
function initDarkMode() {
    const html = document.documentElement;
    const darkModePref = localStorage.getItem('darkMode');

    // Check for saved preference or system preference
    if (darkModePref === 'enabled' ||
        (!darkModePref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        updateDarkModeIcons(true);
    } else {
        html.classList.remove('dark');
        updateDarkModeIcons(false);
    }
}

// Initialize on page load
initDarkMode();

// Dark mode toggle from navbar
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', toggleDarkMode);

// Dark mode toggle from sidebar
const sidebarThemeToggle = document.getElementById('sidebar-theme-toggle');
sidebarThemeToggle.addEventListener('click', toggleDarkMode);

function showToast(type, message) {
    const toastContainer = document.getElementById('toast-container');
    const toastId = Date.now(); // Unique ID for each toast
    const toast = document.createElement('div');
    toast.id = `toast-${toastId}`;
    toast.className = `p-4 rounded-lg shadow-lg flex items-center justify-between transition-all duration-300 max-w-sm opacity-0 transform translate-x-full`;

    // Define toast styles based on type
    const styles = {
        success: 'bg-emerald-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white'
    };

    toast.className += ` ${styles[type]}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="dismissToast(${toastId})" class="ml-4 text-white hover:text-gray-200">✕</button>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-x-full');
    }, 100);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        dismissToast(toastId);
    }, 5000);
}

function dismissToast(toastId) {
    const toast = document.getElementById(`toast-${toastId}`);
    if (toast) {
        toast.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}