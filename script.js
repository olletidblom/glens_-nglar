// Dark mode toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const body = document.body;
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-bs-theme', newTheme);
    body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('.dark-mode-toggle i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', savedTheme);
document.body.setAttribute('data-bs-theme', savedTheme);

// Weather API integration
async function loadWeather() {
    try {
        console.log('Laddar väderdata...');
        const API_KEY = 'b5f233363aa3bd493aaadfc10ee3792f'; // ← Din API-nyckel
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Stockholm&appid=${API_KEY}&units=metric&lang=sv`);
        const data = await response.json();

        console.log("api response:", data); // Logga hela API-svaret för felsökning

        if (data.cod === 200) {
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').textContent = data.weather[0].description;

            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            document.querySelector('.weather-icon').innerHTML = `<img src="${iconUrl}" alt="${data.weather[0].description}" style="height: 50px;">`;
        } else {
            document.getElementById('temperature').textContent = 'Väderdata saknas';
            document.getElementById('description').textContent = '';
        }
    } catch (error) {
        console.error('Fel vid hämtning av väderdata:', error);
        document.getElementById('temperature').textContent = 'Kunde inte ladda väder';
        document.getElementById('description').textContent = '';
    }
}

// Voting system
let votes = {
    awesome: 0,
    legends: 0,
    total: 0
};

function vote(team) {
    votes[team]++;
    votes.total++;
    document.getElementById('voteCount').textContent = `Totalt röster: ${votes.total}`;
    
    // Add animation
    const button = event.target;
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// Like button functionality
function toggleLike(button) {
    const countSpan = button.querySelector('span');
    let count = parseInt(countSpan.textContent);
    
    if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        count--;
    } else {
        button.classList.add('liked');
        count++;
    }
    
    countSpan.textContent = count;
}

// Form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const displayDiv = document.getElementById('messageDisplay');
    const messageP = document.getElementById('displayedMessage');
    
    messageP.innerHTML = `<strong>Namn:</strong> ${name}<br><strong>E-post:</strong> ${email}<br><strong>Meddelande:</strong> ${message}`;
    displayDiv.style.display = 'block';
    displayDiv.scrollIntoView({ behavior: 'smooth' });
    
    this.reset();
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize weather on page load
loadWeather();

// Add scroll effects
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all team cards
document.querySelectorAll('.team-card').forEach(card => {
    observer.observe(card);
});

// Update dark mode icon on load
const currentTheme = document.documentElement.getAttribute('data-bs-theme');
const icon = document.querySelector('.dark-mode-toggle i');
if (icon) {
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}