// InternHub Dashboard - JavaScript Functionality

// Global state management
const AppState = {
    sidebarCollapsed: false,
    currentPage: 'index',
    profileMenuOpen: false,
    profileData: {
        name: "Alex Johnson",
        role: "Software Engineering Student",
        email: "alex.johnson@university.edu",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        university: "Stanford University",
        gpa: "3.8",
        graduationYear: "2025",
        skills: ["React", "JavaScript", "Python", "Node.js", "Git", "AWS", "MongoDB", "TypeScript"],
        bio: "Passionate software engineering student with a strong foundation in full-stack development. I love building innovative solutions and learning new technologies. Currently seeking internship opportunities to apply my skills in real-world projects and contribute to meaningful software development.",
        github: "https://github.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
        portfolio: "https://alexjohnson.dev"
    }
};

// Utility Functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Navigation Functions
function navigateTo(page) {
    if (page.includes('?')) {
        const [pageName, params] = page.split('?');
        const urlParams = new URLSearchParams(params);
        
        // Handle special parameters
        if (urlParams.get('edit') === 'true' && pageName === 'profile.html') {
            localStorage.setItem('profileEditMode', 'true');
        }
        
        window.location.href = pageName;
    } else {
        window.location.href = page;
    }
}

function setActiveNavItem(page) {
    $$('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page || item.href.includes(page)) {
            item.classList.add('active');
        }
    });
    AppState.currentPage = page;
}

// Sidebar Functions
function toggleSidebar() {
    const sidebar = $('#sidebar');
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // On mobile, toggle visibility
        sidebar.classList.toggle('show');
    } else {
        // On desktop, toggle collapsed state
        const toggleIcon = $('#toggleIcon');
        AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
        
        if (AppState.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            toggleIcon.setAttribute('data-lucide', 'chevron-right');
        } else {
            sidebar.classList.remove('collapsed');
            toggleIcon.setAttribute('data-lucide', 'chevron-left');
        }
        
        // Save preference
        localStorage.setItem('sidebarCollapsed', AppState.sidebarCollapsed);
    }
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Profile Menu Functions
function toggleProfileMenu() {
    const profileMenu = $('#profileMenu');
    AppState.profileMenuOpen = !AppState.profileMenuOpen;
    
    if (AppState.profileMenuOpen) {
        profileMenu.classList.add('show');
        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeProfileMenuOnOutsideClick);
        }, 0);
    } else {
        profileMenu.classList.remove('show');
        document.removeEventListener('click', closeProfileMenuOnOutsideClick);
    }
}

function closeProfileMenuOnOutsideClick(event) {
    const profileMenu = $('#profileMenu');
    const profileAvatar = $('.profile-avatar');
    
    if (!profileMenu.contains(event.target) && !profileAvatar.contains(event.target)) {
        profileMenu.classList.remove('show');
        AppState.profileMenuOpen = false;
        document.removeEventListener('click', closeProfileMenuOnOutsideClick);
    }
}

function logout() {
    // This function is now handled in the EJS template
    // Keeping for compatibility but redirecting to the EJS logout
    window.location.href = '/student/logout';
}

// Tab System Functions
function initializeTabs() {
    const tabTriggers = $$('.tab-trigger');
    const tabContents = $$('.tab-content');
    
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetTab = trigger.dataset.tab;
            
            // Remove active class from all triggers and contents
            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked trigger and corresponding content
            trigger.classList.add('active');
            const targetContent = $(`.tab-content[data-tab="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Search and Filter Functions
function initializeSearch() {
    const searchInput = $('#searchInput');
    const locationFilter = $('#locationFilter');
    const typeFilter = $('#typeFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', handleSearch);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', handleSearch);
    }
}

function handleSearch() {
    const searchTerm = $('#searchInput')?.value.toLowerCase() || '';
    const locationFilter = $('#locationFilter')?.value || '';
    const typeFilter = $('#typeFilter')?.value || '';
    
    const internshipItems = $$('.internship-listing');
    
    internshipItems.forEach(item => {
        const role = item.querySelector('.internship-role')?.textContent.toLowerCase() || '';
        const company = item.querySelector('.internship-company')?.textContent.toLowerCase() || '';
        const location = item.querySelector('.internship-location')?.textContent || '';
        const type = item?.dataset.type || '';
        
        const matchesSearch = role.includes(searchTerm) || company.includes(searchTerm);
        const matchesLocation = !locationFilter || location.includes(locationFilter);
        const matchesType = !typeFilter || type === typeFilter;
        
        if (matchesSearch && matchesLocation && matchesType) {
            item.style.display = 'block';
            item.classList.add('fade-in');
        } else {
            item.style.display = 'none';
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Switch Component Functions
function initializeSwitches() {
    $$('.switch').forEach(switchElement => {
        switchElement.addEventListener('click', () => {
            switchElement.classList.toggle('checked');
            const input = switchElement.querySelector('input[type="checkbox"]');
            if (input) {
                input.checked = !input.checked;
                // Trigger change event
                input.dispatchEvent(new Event('change'));
            }
        });
    });
}

// Form Handling Functions
function initializeForms() {
    const forms = $$('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Saving...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Settings saved successfully!', 'success');
    }, 1000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = createElement('div', `notification notification-${type}`, message);
    
    // Add notification to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Profile Management Functions
function loadProfileData() {
    const savedData = getFromLocalStorage('profileData');
    if (savedData) {
        AppState.profileData = { ...AppState.profileData, ...savedData };
    }
}

function saveProfileData() {
    saveToLocalStorage('profileData', AppState.profileData);
}

function updateProfileField(field, value) {
    AppState.profileData[field] = value;
    saveProfileData();
}

// Animation Functions
function animateCountUp(element, start, end, duration = 1000) {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;
    
    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        element.textContent = value;
        
        if (value === end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

// Initialize Application
function initializeApp() {
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
        // Load saved preferences for desktop
        const savedSidebarState = getFromLocalStorage('sidebarCollapsed', false);
        if (savedSidebarState) {
            AppState.sidebarCollapsed = savedSidebarState;
            const sidebar = $('#sidebar');
            const toggleIcon = $('#toggleIcon');
            
            if (sidebar) {
                sidebar.classList.add('collapsed');
                if (toggleIcon) {
                    toggleIcon.setAttribute('data-lucide', 'chevron-right');
                }
            }
        }
    }
    
    // Load profile data
    loadProfileData();
    
    // Initialize components
    initializeTabs();
    initializeSearch();
    initializeSwitches();
    initializeForms();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize icons if Lucide is available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('InternHub Dashboard initialized successfully!');
}

function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = $('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Mobile menu button
    const mobileMenuButton = $('#mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleSidebar);
    }
    
    // Profile menu toggle
    const profileAvatar = $('.profile-avatar');
    if (profileAvatar) {
        profileAvatar.addEventListener('click', toggleProfileMenu);
    }
    
    // Navigation items
    $$('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href && href !== '#') {
                navigateTo(href);
            }
        });
    });
    
    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (AppState.profileMenuOpen) {
                toggleProfileMenu();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleWindowResize, 250));
}

function handleWindowResize() {
    const width = window.innerWidth;
    
    // Auto-collapse sidebar on mobile
    if (width < 768 && !AppState.sidebarCollapsed) {
        toggleSidebar();
    }
}

// Page-specific initialization functions
function initializeDashboardPage() {
    // Animate profile completion percentage
    const completionFill = $('.completion-fill');
    if (completionFill) {
        const percentage = parseInt(completionFill.style.width);
        completionFill.style.width = '0%';
        setTimeout(() => {
            completionFill.style.width = '85%';
        }, 500);
    }
    
    // Animate any counters
    $$('[data-count-up]').forEach(element => {
        const target = parseInt(element.dataset.countUp);
        animateCountUp(element, 0, target);
    });
}

function initializeProfilePage() {
    // Check if edit mode is requested
    const editMode = getFromLocalStorage('profileEditMode', false);
    if (editMode) {
        localStorage.removeItem('profileEditMode');
        // Switch to edit mode if this were the profile page
        console.log('Profile edit mode requested');
    }
}

function initializeInternshipsPage() {
    // Set up internship filtering and searching
    initializeSearch();
    
    // Set up pagination if needed
    setupPagination();
}

function initializeSettingsPage() {
    // Load saved settings
    loadSettingsData();
    
    // Set up settings form handlers
    setupSettingsHandlers();
}

function setupPagination() {
    // Implement pagination logic for internship listings
    const itemsPerPage = 10;
    const items = $$('.internship-listing');
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    // Show only first page initially
    items.forEach((item, index) => {
        if (index >= itemsPerPage) {
            item.style.display = 'none';
        }
    });
}

function loadSettingsData() {
    const savedSettings = getFromLocalStorage('userSettings', {});
    
    // Apply saved settings to form elements
    Object.keys(savedSettings).forEach(key => {
        const element = $(`[name="${key}"]`);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = savedSettings[key];
                // Update switch visual state
                const switchContainer = element.closest('.switch');
                if (switchContainer) {
                    switchContainer.classList.toggle('checked', savedSettings[key]);
                }
            } else {
                element.value = savedSettings[key];
            }
        }
    });
}

function setupSettingsHandlers() {
    // Handle settings changes
    $$('input, select').forEach(element => {
        element.addEventListener('change', (e) => {
            const name = e.target.name;
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            
            // Save to local storage
            const settings = getFromLocalStorage('userSettings', {});
            settings[name] = value;
            saveToLocalStorage('userSettings', settings);
            
            console.log(`Setting ${name} updated to:`, value);
        });
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for global access
window.InternHub = {
    navigateTo,
    toggleSidebar,
    toggleProfileMenu,
    logout,
    setActiveNavItem,
    showNotification,
    AppState
};
