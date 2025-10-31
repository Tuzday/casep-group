//  Auto-hide Navbar Script
let lastScrollTop = 0;
const navbar = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scroll down → hide navbar
        navbar.classList.add('hidden');
    } else {
        // Scroll up → show navbar
        navbar.classList.remove('hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ========== Basic Utilities & Setup ==========
document.getElementById('year').textContent = new Date().getFullYear();

// ========= Navbar behavior on scroll (keeps transparent; only padding changes) =========
const nav = document.getElementById('mainNav');

function handleNav() {
    if (window.scrollY > 40) {
        nav.classList.add('navbar-shrink');
    } else {
        nav.classList.remove('navbar-shrink');
    }
}
handleNav();
window.addEventListener('scroll', handleNav);

// ========= Reveal on scroll =========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, {
    threshold: 0.12
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ========= Counters animation =========
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.getAttribute('data-target');
            let start = 0;
            const duration = 1600;
            const stepTime = Math.max(10, Math.abs(Math.floor(duration / target)));
            const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = start;
                }
            }, stepTime);
            statObserver.unobserve(el);
        }
    });
}, {
    threshold: 0.3
});

document.querySelectorAll('.stat').forEach(s => statObserver.observe(s));

// ========= Back to top ========= //
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backBtn.style.display = 'block';
    else backBtn.style.display = 'none';
});
backBtn.addEventListener('click', () => window.scrollTo({
    top: 0,
    behavior: 'smooth'
}));

// ========= Smooth scroll for anchor links ========= //
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;
            const navHeight = nav.offsetHeight + 8;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
            // collapse mobile menu
            const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navMenu'));
            if (bsCollapse && window.getComputedStyle(document.querySelector('.navbar-toggler')).display !== 'none') {
                bsCollapse.hide();
            }
        }
    });
});

// ========= Service modal logic (existing) =========
const services = {
    "Accounting": {
        title: "Accounting Services",
        body: "<p>Comprehensive financial management: bookkeeping, auditing, payroll management, tax advisory, compliance and strategic financial planning. We provide timely financial reports and actionable insights.</p>"
    },
    "Human Resource": {
        title: "Human Resource Services",
        body: "<p>Recruitment, HR outsourcing, performance management, workforce training and organisational development. We help build effective teams and HR systems.</p>"
    },
    "Marketing": {
        title: "Marketing Services",
        body: "<p>Brand positioning, market research, campaign planning, and customer engagement strategies designed to grow your market share.</p>"
    },
    "Advertising": {
        title: "Advertising Services",
        body: "<p>Creative campaigns, media management and content creation across digital and traditional channels to ensure your message reaches the right audience.</p>"
    },
    "Technology": {
        title: "Technology Services",
        body: "<p>Digital transformation, IT infrastructure, software development, cybersecurity and systems integration to modernize your operations.</p>"
    },
    "Consulting": {
        title: "Consulting Services",
        body: "<p>Strategic advisory, process improvement and implementation support to help your business operate more effectively and profitably.</p>"
    },
    "all": {
        title: "Our Services",
        body: "<p>Explore our core services: Accounting, Human Resource, Marketing, Advertising, Technology and Consulting. Choose a service to see detailed offerings and enquire directly.</p>"
    }
};

const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal'));
let selectedServiceName = 'all';

document.querySelectorAll('.service-details, #openServiceModalBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const name = btn.dataset.service || btn.getAttribute('data-service') || 'all';
        selectedServiceName = name;
        const info = services[name] || services['all'];
        document.getElementById('serviceModalTitle').textContent = info.title;
        document.getElementById('serviceModalBody').innerHTML = info.body + '<hr><p><strong>Ready to discuss?</strong> Click Enquire to open the quick contact form.</p>';
        serviceModal.show();
    });
});

// Enquire -> open contact modal prefilling
document.getElementById('modalEnquireBtn').addEventListener('click', () => {
    serviceModal.hide();
    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
    const mservice = document.getElementById('mservice');
    if (mservice) {
        let found = false;
        for (let i = 0; i < mservice.options.length; i++) {
            if (mservice.options[i].text === selectedServiceName) {
                mservice.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found) mservice.value = selectedServiceName;
    }
    contactModal.show();
});

// ========= Contact form handling (simulate) =========
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    simulateSend({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        service: document.getElementById('serviceSelect').value,
        message: document.getElementById('message').value
    });
});

const modalContactForm = document.getElementById('modalContactForm');
modalContactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sendBtn = document.getElementById('modalSendBtn');
    const modalAlert = document.getElementById('modalAlert');

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

    setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = 'Send Enquiry';
        modalAlert.className = 'alert alert-success';
        modalAlert.textContent = 'Your enquiry has been simulated as sent. Thank you!';
        modalAlert.classList.remove('d-none');

        setTimeout(() => {
            const bsContactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            bsContactModal?.hide();
            const thank = new bootstrap.Modal(document.getElementById('thankModal'));
            thank.show();
            modalContactForm.reset();
            modalAlert.classList.add('d-none');
        }, 900);
    }, 1400);
});

function simulateSend(payload) {
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending...';
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = 9999;
        toast.innerHTML = '<div class="toast show align-items-center text-bg-success border-0"><div class="d-flex"><div class="toast-body">Thanks! Your message was simulated as sent.</div><button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button></div></div>';
        document.body.appendChild(toast);
        toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
        contactForm.reset();
    }, 1200);
}

// ========= Small enhancements =========
document.querySelectorAll('#navMenu .nav-link').forEach(navlink => {
    navlink.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navMenu'));
        if (bsCollapse && window.innerWidth < 992) bsCollapse.hide();
    });
});

const testimonialEl = document.querySelector('#testimonialCarousel');
if (testimonialEl) {
    new bootstrap.Carousel(testimonialEl, {
        interval: 4500,
        ride: 'carousel'
    });
}

const contactModalEl = document.getElementById('contactModal');
contactModalEl.addEventListener('shown.bs.modal', () => {
    document.getElementById('mname').focus();
});

window.addEventListener('load', () => {
    document.querySelectorAll('.hero-content.reveal').forEach(h => h.classList.add('visible'));
});

// ========= Advanced Chatbot Implementation =========

const chatLaunch = document.getElementById('chatLaunch');
const chatPanel = document.getElementById('chatPanel');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const closeChat = document.getElementById('closeChat');
const clearChatBtn = document.getElementById('clearChat');
const exportChatBtn = document.getElementById('exportChat');

// localStorage key for chat history
const CHAT_KEY = 'casep_chat_history_v1';

// default bot behavior - customizable responses
const BOT_KB = [
    { q: /pricing|price|cost/i, a: "Our pricing depends on the service and scale. For a quick estimate, tell me which service you're interested in and approximate scope (e.g., monthly bookkeeping for 1-5 employees)." },
    { q: /accounting/i, a: "We offer bookkeeping, audits, payroll management, tax advisory and strategic financial planning. Want a detailed PDF-ready scope?" },
    { q: /hr|human resource|hiring/i, a: "We provide recruitment, HR outsourcing, performance management, and training programs. Would you like sample packages?" },
    { q: /marketing/i, a: "Marketing services include brand positioning, market research, and campaign planning. Tell me your industry for suggestions." },
    { q: /advertis|ad campaig/i, a: "We handle creative campaigns, media buying and content production across digital and traditional channels." },
    { q: /technology|it|software/i, a: "Technology services: digital transformation, systems integration, software development, and cybersecurity." },
    { q: /consult/i, a: "Our consulting team focuses on strategy, operations improvement, and implementation support. What's your primary challenge?" },
    { q: /contact|reach|call/i, a: "You can reach us via the contact form on the site or send an email to info@casep.example (replace with your real email). Want me to open the contact form?" }
];

// small helper to append messages
function appendMessage(text, who = 'bot', meta = {}) {
    const el = document.createElement('div');
    el.className = 'message ' + (who === 'user' ? 'user' : 'bot');
    el.innerHTML = text;
    if (meta && meta.timestamp) {
        el.setAttribute('data-ts', meta.timestamp);
    }
    chatBody.appendChild(el);
    // keep scroll at bottom
    setTimeout(() => chatBody.scrollTop = chatBody.scrollHeight, 60);
}

// typing indicator element
function createTypingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'message bot';
    const typing = document.createElement('div');
    typing.className = 'typing';
    const dot1 = document.createElement('span'); dot1.className = 'dot';
    const dot2 = document.createElement('span'); dot2.className = 'dot';
    const dot3 = document.createElement('span'); dot3.className = 'dot';
    typing.appendChild(dot1);
    typing.appendChild(dot2);
    typing.appendChild(dot3);
    wrap.appendChild(typing);
    return wrap;
}

// load saved history
function loadHistory() {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    try {
        const arr = JSON.parse(raw);
        arr.forEach(item => {
            appendMessage(item.text, item.who, { timestamp: item.ts });
        });
        return arr;
    } catch (e) {
        console.warn('Failed to parse chat history', e);
        localStorage.removeItem(CHAT_KEY);
        return [];
    }
}

// save message (persist)
function saveMessage(who, text) {
    const ts = Date.now();
    const raw = localStorage.getItem(CHAT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ who, text, ts });
    localStorage.setItem(CHAT_KEY, JSON.stringify(arr));
}

// clear history
function clearHistory() {
    localStorage.removeItem(CHAT_KEY);
    chatBody.innerHTML = '';
}

// export history as text file
function exportHistory() {
    const raw = localStorage.getItem(CHAT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    let text = 'CASEP Chat Export\n\n';
    arr.forEach(m => {
        const time = new Date(m.ts).toLocaleString();
        text += `[${time}] ${m.who.toUpperCase()}: ${m.text}\n\n`;
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'casep-chat-export.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// simple bot response engine (synchronous-ish with typing delay)
function botRespond(userText) {
    // find keyword match
    for (const kb of BOT_KB) {
        if (kb.q.test(userText)) {
            return kb.a;
        }
    }
    // fallback small logic
    if (/help|support|assist/i.test(userText)) {
        return "I'm here to help — tell me what you need: pricing, services, partnerships, or contact details.";
    }
    // friendly fallback
    return "Thanks for asking! Could you share a bit more detail so I can provide a helpful answer (e.g., which service or what goal)?";
}

// send flow (user message -> save -> show typing -> bot reply -> save)
function handleSendMessage(rawText) {
    const text = (rawText || '').trim();
    if (!text) return;
    appendMessage(escapeHtml(text), 'user');
    saveMessage('user', text);
    chatInput.value = '';
    chatInput.focus();

    // show typing indicator
    const typingEl = createTypingIndicator();
    chatBody.appendChild(typingEl);
    chatBody.scrollTop = chatBody.scrollHeight;

    // simulate typing delay based on length
    const delay = Math.min(1400 + text.length * 20, 3000);
    setTimeout(() => {
        // remove typing
        typingEl.remove();

        // generate reply
        const reply = botRespond(text);
        appendMessage(escapeHtml(reply), 'bot');
        saveMessage('bot', reply);
    }, delay);
}

// escape simple HTML for messages
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[m];
    });
}

// open/close chat panel
function openChat() {
    chatPanel.classList.add('open');
    chatPanel.classList.remove('minimized');
    chatPanel.setAttribute('aria-hidden', 'false');
    chatInput.focus();
}

function closeChatPanel() {
    chatPanel.classList.remove('open');
    chatPanel.classList.add('minimized');
    chatPanel.setAttribute('aria-hidden', 'true');
}

// initialize chat UI and events
(function initChat() {
    // load existing history
    loadHistory();

    // if no history, show welcome message
    const raw = localStorage.getItem(CHAT_KEY);
    const had = raw ? JSON.parse(raw) : [];
    if (!had || had.length === 0) {
        const welcome = "Hi! I'm CASEP Assistant — I can help with services, pricing estimates, or getting you in touch with our team. Try asking: 'what services do you offer?'";
        appendMessage(escapeHtml(welcome), 'bot');
        saveMessage('bot', welcome);
    }

    // toggle open on launch click
    chatLaunch.addEventListener('click', () => {
        if (chatPanel.classList.contains('open')) {
            closeChatPanel();
        } else {
            openChat();
        }
    });

    // close button
    closeChat.addEventListener('click', () => closeChatPanel());

    // send on button
    sendBtn.addEventListener('click', () => {
        handleSendMessage(chatInput.value);
    });

    // send on Enter
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(chatInput.value);
        }
    });

    // clear
    clearChatBtn.addEventListener('click', () => {
        if (confirm('Clear chat history?')) {
            clearHistory();
            const welcome2 = "Chat cleared. I'm CASEP Assistant — ask me anything about our services.";
            appendMessage(escapeHtml(welcome2), 'bot');
            saveMessage('bot', welcome2);
        }
    });

    // export
    exportChatBtn.addEventListener('click', exportHistory);

    // accessibility: close chat with Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeChatPanel();
    });

    // theme sync for chat-launch icon color (update on load & theme changes)
    function updateChatIconTheme() {
        const theme = bodyEl.getAttribute('data-theme');
        const icon = chatLaunch.querySelector('i');
        if (theme === 'dark') icon.style.color = '#FFF';
        else icon.style.color = '#07111a';
    }
    updateChatIconTheme();
    // update when theme toggled (observe localStorage maybe)
    const mo = new MutationObserver(updateChatIconTheme);
    mo.observe(bodyEl, { attributes: true, attributeFilter: ['data-theme'] });
})();

// End of chat implementation