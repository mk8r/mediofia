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
    '/terms': 'terms',
    '/article': 'article-view' // ✅ New Route for Article Reader
};

// --- ROUTER LOGIC ---
const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    let path = window.location.pathname;
    
    // Clean up path for local development
    if (path.endsWith('/') && path.length > 1) path = path.slice(0, -1);
    
    let targetId = 'home';

    // 1. Check if it is a specific Article URL (e.g. /article/rise-of-ai)
    if (path.includes('/article/')) {
        const slug = path.split('/article/')[1];
        loadArticle(slug); // This triggers content + SEO update
        targetId = 'article-view';
    } 
    // 2. Standard Routing
    else {
        const pathSegments = path.split('/').filter(Boolean);
        const lastSegment = pathSegments.length > 0 ? '/' + pathSegments[pathSegments.length - 1] : '/';
        targetId = routes[path] || routes[lastSegment] || 'home';
        
        // Reset SEO to default if NOT reading an article
        resetPageSEO();
    }

    // 3. Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // 4. Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);

        // ✅ Trigger: If visiting the main Blog page, render the list
        if (targetId === 'blog') {
            renderBlogList();
        }
    } else {
        // 404 Handler - Default to Home
        document.getElementById('home').classList.add('active');
        resetPageSEO();
    }

    // 5. Update Navigation State
    updateNavHighlight(path);
};

function updateNavHighlight(fullPath) {
    document.querySelectorAll('nav a, #mobile-menu a').forEach(link => {
        link.classList.remove('text-brand-cyan');
        const linkHref = link.getAttribute('href');
        // Simple check: does the current path end with this link?
        if (fullPath === linkHref || (fullPath === '/' && linkHref === '/')) {
            link.classList.add('text-brand-cyan');
        }
    });
}

// --- BLOG SYSTEM & SEO LOGIC (Master Level) ---

// 1. Render the Grid of Cards (Blog Page)
function renderBlogList() {
    const grid = document.getElementById('blog-grid');
    if (!grid || typeof blogPosts === 'undefined') return;
    
    grid.innerHTML = blogPosts.map(post => `
        <div class="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 ${post.borderColor}" onclick="navigateTo('/article/${post.id}')">
            <div class="h-56 bg-gray-800 relative overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <span class="absolute top-4 left-4 z-20 ${post.categoryColor} bg-black/80 backdrop-blur border border-white/10 text-xs font-bold px-3 py-1 rounded-full">
                    ${post.category}
                </span>
            </div>
            <div class="p-8">
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>${post.date}</span> • <span>${post.author}</span>
                </div>
                <h3 class="text-xl font-bold text-white mb-3 group-hover:${post.categoryColor} transition">${post.title}</h3>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">${post.summary}</p>
                <span class="${post.categoryColor} text-sm font-bold flex items-center gap-2">
                    Read Article <i class="fas fa-arrow-right text-xs"></i>
                </span>
            </div>
        </div>
    `).join('');
}

// 2. Load Single Article & Update SEO
function loadArticle(slug) {
    if (typeof blogPosts === 'undefined') return;
    const post = blogPosts.find(p => p.id === slug);
    
    if (!post) {
        navigateTo('/blog');
        return;
    }

    // Populate HTML
    document.getElementById('article-title').innerText = post.title;
    document.getElementById('article-image').src = post.image;
    document.getElementById('article-image').alt = post.title + " - Mediofia Insights";
    document.getElementById('article-author').innerText = post.author;
    
    document.getElementById('article-meta').innerHTML = `
        <span class="${post.categoryColor} font-bold">${post.category}</span>
        <span>|</span>
        <span>${post.date}</span>
    `;
    
    document.getElementById('article-body').innerHTML = post.content;

    // ✅ TRIGGER MASTER SEO UPDATE
    updatePageSEO(post);
}

// 3. Update SEO Metadata (Dynamic Head)
function updatePageSEO(post) {
    // Title
    document.title = post.metaTitle || post.title;

    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", post.metaDescription);

    // Keywords (Optional but good for Bing/Yandex)
    let metaKeys = document.querySelector('meta[name="keywords"]');
    if (!metaKeys) {
        metaKeys = document.createElement('meta');
        metaKeys.name = "keywords";
        document.head.appendChild(metaKeys);
    }
    if (post.keywords) metaKeys.setAttribute("content", post.keywords);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://mediofia.com/article/${post.id}`);

    // Open Graph
    updateMetaProperty('og:title', post.metaTitle || post.title);
    updateMetaProperty('og:description', post.metaDescription);
    updateMetaProperty('og:url', `https://mediofia.com/article/${post.id}`);
    updateMetaProperty('og:image', post.image);

    // Inject Schema JSON-LD
    const schemaId = 'dynamic-schema';
    let existingSchema = document.getElementById(schemaId);
    if (existingSchema) existingSchema.remove();

    const script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mediofia",
            "logo": {
                "@type": "ImageObject",
                "url": "https://mediofia.com/mediofia_main.png"
            }
        },
        "datePublished": post.date,
        "description": post.metaDescription
    });
    document.head.appendChild(script);
}

// Helper to update meta property tags
function updateMetaProperty(propName, content) {
    let tag = document.querySelector(`meta[property="${propName}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', propName);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

// 4. Reset SEO to Default (When leaving article)
function resetPageSEO() {
    document.title = "Mediofia | Global Digital Growth Agency & AI Automation";
    
    const defaultDesc = "Mediofia - Premium Digital Marketing, AI Automation & Web Development Agency. Scaling brands with data-driven strategies.";
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute("content", defaultDesc);

    const canonical = document.querySelector('link[rel="canonical"]');
    if(canonical) canonical.setAttribute("href", "https://mediofia.com" + window.location.pathname);

    // Remove dynamic schema
    const dynamicSchema = document.getElementById('dynamic-schema');
    if (dynamicSchema) dynamicSchema.remove();
}


// --- EVENT LISTENERS ---

// 1. Handle Back/Forward Browser Buttons
window.addEventListener("popstate", router);

// 2. Handle Link Clicks
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const targetLink = e.target.closest("[data-link]");
        if (targetLink) {
            e.preventDefault();
            if (document.body.classList.contains('menu-open')) {
                toggleMobileMenu();
            }
            navigateTo(targetLink.getAttribute('href'));
        }
    });

    // Initial Load
    router();
});


// --- UI LOGIC ---

// 1. Scroll Events (Sticky Header + Reading Progress)
window.addEventListener('scroll', () => {
    // Sticky Header
    const header = document.getElementById('navbar');
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Reading Progress Bar (For Articles)
    const scrollProgress = document.getElementById('scroll-progress');
    if(scrollProgress) {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        // Avoid division by zero
        if (totalHeight > 0) {
            const progress = (window.pageYOffset / totalHeight) * 100;
            scrollProgress.style.width = progress + "%";
        }
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

// --- ANTI-THEFT PROTECTION ---

// 1. Disable Right Click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 2. Disable Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if(e.key === 'F12') e.preventDefault();
    if(e.ctrlKey && e.shiftKey && e.key === 'I') e.preventDefault();
    if(e.ctrlKey && e.shiftKey && e.key === 'J') e.preventDefault();
    if(e.ctrlKey && e.key === 'u') e.preventDefault();
});