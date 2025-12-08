// --- CONFIGURATION ---
// Map URL paths to Section IDs
const routes = {
    '/': 'home',
    '/index.html': 'home', // Fallback for local files
    '/services': 'services',
    '/solutions': 'solutions',
    '/about': 'about',
    '/case-studies': 'case-studies',
    '/blog': 'blog',
    '/contact': 'contact',
    '/privacy': 'privacy',
    '/terms': 'terms'
};

// --- ROUTER LOGIC ---
const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    // 1. Get current path (e.g., "/services")
    // We handle local dev environments that might have a subfolder
    let path = window.location.pathname;
    
    // Clean up path for local development (remove "index.html" or trailing slashes)
    if (path.endsWith('/') && path.length > 1) path = path.slice(0, -1);
    
    // If we are in a subfolder (e.g. /Mediofia_Website/services), extract the last part
    const pathSegments = path.split('/').filter(Boolean);
    const lastSegment = pathSegments.length > 0 ? '/' + pathSegments[pathSegments.length - 1] : '/';
    
    // Find the matching section ID
    // If exact match doesn't exist, check the last segment, otherwise default to 'home'
    let targetId = routes[path] || routes[lastSegment] || 'home';

    // 2. Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // 3. Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        // 404 Handler - Default to Home if section missing
        document.getElementById('home').classList.add('active');
    }

    // 4. Update Navigation State (Highlight active link)
    updateNavHighlight(path, lastSegment);
};

function updateNavHighlight(fullPath, segment) {
    document.querySelectorAll('nav a, #mobile-menu a').forEach(link => {
        link.classList.remove('text-brand-cyan');
        // Check if the link's href matches the current path
        const linkHref = link.getAttribute('href');
        if (linkHref === fullPath || linkHref === segment) {
            link.classList.add('text-brand-cyan');
        }
    });
}

// --- EVENT LISTENERS ---

// 1. Handle Back/Forward Browser Buttons
window.addEventListener("popstate", router);

// 2. Handle Link Clicks (The "SPA" Magic)
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        // Find if the clicked element (or its parent) has the [data-link] attribute
        const targetLink = e.target.closest("[data-link]");
        
        if (targetLink) {
            e.preventDefault(); // Stop the browser from reloading
            
            // Close mobile menu if open
            if (document.body.classList.contains('menu-open')) {
                toggleMobileMenu();
            }

            navigateTo(targetLink.href);
        }
    });

    // Initial Load
    router();
});


// --- UI LOGIC (Header & Mobile Menu) ---

// Sticky Navbar Logic
window.addEventListener('scroll', () => {
    const header = document.getElementById('navbar');
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function checkMobileHeader() {
    const header = document.getElementById('navbar');
    if(window.innerWidth < 1024) {
         header.classList.add('mobile-bg');
    } else {
        header.classList.remove('mobile-bg');
    }
}
window.addEventListener('resize', checkMobileHeader);
checkMobileHeader(); 

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('translate-x-full');
    document.body.classList.toggle('menu-open');
}

if(mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
if(closeBtn) closeBtn.addEventListener('click', toggleMobileMenu);

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-tab', 'border-brand-blue', 'text-brand-blue');
        btn.classList.add('border-white/10');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active-tab', 'border-brand-blue', 'text-brand-blue');
            btn.classList.remove('border-white/10');
        }
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        setTimeout(() => {
            targetContent.classList.add('active');
        }, 100);
    }
}

// Init Tabs
const firstTab = document.querySelector('[data-tab="ecommerce"]');
if (firstTab) {
    firstTab.classList.add('border-brand-blue', 'text-brand-blue');
    firstTab.classList.remove('border-white/10');
}

