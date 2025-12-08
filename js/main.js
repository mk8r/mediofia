// --- Navigation Logic ---
function navigateTo(pageId) {
    // Update active link style
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('text-brand-cyan');
        if(link.getAttribute('onclick').includes(pageId)) {
            link.classList.add('text-brand-cyan');
        }
    });

    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    // Show target section
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// --- Sticky Navbar with Mobile Fix ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('navbar');
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Ensure mobile header has background initially if needed
function checkMobileHeader() {
    const header = document.getElementById('navbar');
    if(window.innerWidth < 1024) {
            header.classList.add('mobile-bg');
    } else {
        header.classList.remove('mobile-bg');
    }
}
window.addEventListener('resize', checkMobileHeader);
checkMobileHeader(); // Init

// --- Mobile Menu ---
const mobileBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('translate-x-full');
    // Prevent scrolling when menu is open
    document.body.classList.toggle('menu-open');
}

if(mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
if(closeBtn) closeBtn.addEventListener('click', toggleMobileMenu);

// --- Tab Switching (Industries) ---
function switchTab(tabId) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-tab', 'border-brand-blue', 'text-brand-blue');
        btn.classList.add('border-white/10');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active-tab', 'border-brand-blue', 'text-brand-blue');
            btn.classList.remove('border-white/10');
        }
    });

    // Update Content with Fade
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

// Initialize first tab button style if tabs exist
const firstTab = document.querySelector('[data-tab="ecommerce"]');
if (firstTab) {
    firstTab.classList.add('border-brand-blue', 'text-brand-blue');
    firstTab.classList.remove('border-white/10');
}

// --- Form Handling ---
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = 'Request Received <i class="fas fa-check"></i>';
        btn.classList.remove('from-brand-blue', 'to-brand-cyan');
        btn.classList.add('bg-green-500', 'text-white');
        e.target.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.add('from-brand-blue', 'to-brand-cyan');
            btn.classList.remove('bg-green-500', 'text-white');
        }, 4000);
    }, 2000);
}