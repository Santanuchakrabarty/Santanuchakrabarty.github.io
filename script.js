// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check localStorage for theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    htmlElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-theme') === 'light') {
        htmlElement.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon from bars to cross
    if (navLinks.classList.contains('active')) {
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Close mobile menu on link click
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Scroll Event for Navbar
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.portfolio-filters li');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('filter-active'));
        button.classList.add('filter-active');
        
        const filterValue = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Command Palette Logic
const cmdOverlay = document.getElementById('command-palette-overlay');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');
const cmdBtn = document.getElementById('cmd-k-btn');

// Adjust cmd-k text based on OS
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const cmdTextEl = document.querySelector('.cmd-k-text');
if (cmdTextEl) {
    cmdTextEl.textContent = isMac ? '⌘K' : 'Ctrl+K';
}

const commands = [
    { id: 'home', title: 'Go to Home', icon: 'fa-home', action: () => scrollToSection('home') },
    { id: 'about', title: 'Go to About', icon: 'fa-user', action: () => scrollToSection('about') },
    { id: 'skills', title: 'Go to Skills', icon: 'fa-code', action: () => scrollToSection('skills') },
    { id: 'resume', title: 'Go to Resume', icon: 'fa-file-alt', action: () => scrollToSection('resume') },
    { id: 'portfolio', title: 'Go to Portfolio', icon: 'fa-briefcase', action: () => scrollToSection('portfolio') },
    { id: 'contact', title: 'Go to Contact', icon: 'fa-envelope', action: () => scrollToSection('contact') },
    { id: 'theme', title: 'Toggle Theme', icon: 'fa-adjust', action: toggleThemeFromCmd },
    { id: 'github', title: 'Open GitHub', icon: 'fa-github', action: () => window.open('https://github.com/santanuchakrabarty', '_blank') },
    { id: 'linkedin', title: 'Open LinkedIn', icon: 'fa-linkedin', action: () => window.open('https://www.linkedin.com/in/santanu-chakrabarty', '_blank') },
    { id: 'email', title: 'Copy Email', icon: 'fa-copy', action: copyEmail }
];

let filteredCommands = [...commands];
let selectedIndex = 0;

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    closePalette();
}

function toggleThemeFromCmd() {
    document.getElementById('theme-toggle').click();
    closePalette();
}

function copyEmail() {
    navigator.clipboard.writeText('chakrabartys12@gmail.com').then(() => {
        cmdInput.value = "Copied to clipboard!";
        setTimeout(closePalette, 800);
    }).catch(() => {
        cmdInput.value = "Failed to copy";
        setTimeout(closePalette, 800);
    });
}

function openPalette() {
    cmdOverlay.style.display = 'flex';
    // Small delay to allow display: flex to take effect before adding the transition class
    setTimeout(() => {
        cmdOverlay.classList.add('active');
        cmdInput.value = '';
        filterCommands('');
        cmdInput.focus();
    }, 10);
}

function closePalette() {
    cmdOverlay.classList.remove('active');
    setTimeout(() => {
        cmdOverlay.style.display = 'none';
    }, 150); // Matches CSS transition duration
}

cmdBtn.addEventListener('click', openPalette);

cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) closePalette();
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay.classList.contains('active')) closePalette();
        else openPalette();
    }
    
    if (e.key === 'Escape' && cmdOverlay.classList.contains('active')) {
        closePalette();
    }
});

cmdInput.addEventListener('input', (e) => {
    filterCommands(e.target.value);
});

cmdInput.addEventListener('keydown', (e) => {
    if (filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderCommands();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderCommands();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
    }
});

function filterCommands(query) {
    query = query.toLowerCase();
    
    if (!query) {
        filteredCommands = [...commands];
    } else {
        filteredCommands = commands.filter(cmd => {
            const title = cmd.title.toLowerCase();
            let queryIdx = 0;
            for (let i = 0; i < title.length; i++) {
                if (title[i] === query[queryIdx]) {
                    queryIdx++;
                }
                if (queryIdx === query.length) return true;
            }
            return false;
        });
    }
    
    selectedIndex = 0;
    renderCommands();
}

function renderCommands() {
    cmdResults.innerHTML = '';
    
    if (filteredCommands.length === 0) {
        cmdResults.innerHTML = '<div class="cmd-no-results">No results found</div>';
        return;
    }
    
    filteredCommands.forEach((cmd, index) => {
        const item = document.createElement('div');
        item.className = `cmd-item ${index === selectedIndex ? 'selected' : ''}`;
        item.innerHTML = `<i class="fas ${cmd.icon}"></i> <span>${cmd.title}</span>`;
        
        item.addEventListener('click', () => {
            cmd.action();
        });
        
        item.addEventListener('mouseenter', () => {
            const prevSelected = cmdResults.querySelector('.selected');
            if (prevSelected) prevSelected.classList.remove('selected');
            item.classList.add('selected');
            selectedIndex = index;
        });
        
        cmdResults.appendChild(item);
    });
    
    const selectedEl = cmdResults.querySelector('.selected');
    if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
    }
}

// GitHub Recent Activity Logic
(function() {
    const GITHUB_USERNAME = 'santanuchakrabarty';
    const CACHE_KEY = 'gh_activity_cache';
    const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes
    const MAX_EVENTS = 5;
    const ALLOWED_EVENTS = ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'];
    
    const container = document.getElementById('gh-activity-container');
    const section = document.getElementById('recent-activity');
    if (!container || !section) return;

    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (secondsPast < 60) return secondsPast + ' seconds ago';
        if (secondsPast < 3600) return Math.floor(secondsPast / 60) + ' minutes ago';
        if (secondsPast <= 86400) return Math.floor(secondsPast / 3600) + ' hours ago';
        if (secondsPast > 86400) {
            const days = Math.floor(secondsPast / 86400);
            return days === 1 ? '1 day ago' : days + ' days ago';
        }
    }

    function renderEvents(events) {
        container.innerHTML = '';
        
        if (!events || events.length === 0) {
            section.style.display = 'none';
            return;
        }

        events.forEach((event, index) => {
            let iconClass = 'fa-code';
            let desc = '';
            const repoName = event.repo.name;
            const repoUrl = `https://github.com/${repoName}`;

            switch (event.type) {
                case 'PushEvent':
                    iconClass = 'fa-code-branch';
                    const commitCount = event.payload.commits ? event.payload.commits.length : 0;
                    const branch = event.payload.ref ? event.payload.ref.replace('refs/heads/', '') : 'branch';
                    desc = `Pushed ${commitCount} commit(s) to <strong>${branch}</strong>`;
                    if (commitCount > 0) {
                        let msg = event.payload.commits[0].message.split('\n')[0];
                        if (msg.length > 60) msg = msg.substring(0, 57) + '...';
                        desc += `<br><span style="font-size:0.9em; opacity:0.8;">"${msg}"</span>`;
                    }
                    break;
                case 'CreateEvent':
                    iconClass = 'fa-book';
                    if (event.payload.ref_type === 'repository') {
                        desc = 'Created repository';
                    } else {
                        desc = `Created ${event.payload.ref_type} <strong>${event.payload.ref}</strong>`;
                    }
                    break;
                case 'PullRequestEvent':
                    iconClass = 'fa-code-pull-request';
                    const prAction = event.payload.action;
                    let prTitle = event.payload.pull_request.title;
                    if (prTitle.length > 60) prTitle = prTitle.substring(0, 57) + '...';
                    desc = `${prAction.charAt(0).toUpperCase() + prAction.slice(1)} a pull request: <strong>${prTitle}</strong>`;
                    break;
                case 'IssuesEvent':
                    iconClass = 'fa-circle-exclamation';
                    const issueAction = event.payload.action;
                    let issueTitle = event.payload.issue.title;
                    if (issueTitle.length > 60) issueTitle = issueTitle.substring(0, 57) + '...';
                    desc = `${issueAction.charAt(0).toUpperCase() + issueAction.slice(1)} an issue: <strong>${issueTitle}</strong>`;
                    break;
            }

            const item = document.createElement('div');
            item.className = 'activity-item';
            item.style.animationDelay = `${index * 50}ms`;
            
            item.innerHTML = `
                <div class="activity-icon"><i class="fas ${iconClass}"></i></div>
                <div class="activity-content">
                    <div class="activity-repo">
                        <a href="${repoUrl}" target="_blank">${repoName}</a>
                        <span class="activity-time">${timeAgo(event.created_at)}</span>
                    </div>
                    <div class="activity-desc">${desc}</div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    async function fetchGitHubActivity() {
        const cachedStr = localStorage.getItem(CACHE_KEY);
        if (cachedStr) {
            try {
                const cachedData = JSON.parse(cachedStr);
                if (Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
                    renderEvents(cachedData.events);
                    return;
                }
            } catch (e) {}
        }

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
            if (!response.ok) throw new Error('API Error');
            
            const data = await response.json();
            
            const filteredEvents = data
                .filter(event => ALLOWED_EVENTS.includes(event.type))
                .slice(0, MAX_EVENTS);
                
            if (filteredEvents.length === 0) {
                section.style.display = 'none';
                return;
            }

            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                events: filteredEvents
            }));

            renderEvents(filteredEvents);

        } catch (error) {
            console.error('Failed to fetch GitHub activity:', error);
            section.style.display = 'none';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchGitHubActivity);
    } else {
        fetchGitHubActivity();
    }
})();
