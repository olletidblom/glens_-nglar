
        // Team Members Functions
        async function loadTeamMembers() {
            const teamContainer = document.getElementById('teamContainer');
            const loadingTeam = document.getElementById('loadingTeam');
            
            try {
                const { data: teamMembers, error } = await supabase
                    .from('team_members')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                loadingTeam.classList.add('hidden');
                
                // Clear existing content except loading
                const existingCards = teamContainer.querySelectorAll('.col-lg-4:not(#loadingTeam)');
                existingCards.forEach(card => card.remove());

                // Add team members from database
                teamMembers.forEach(member => {
                    const memberCard = createTeamCard(member, true);
                    teamContainer.appendChild(memberCard);
                });

                // Add static team members (your existing ones)
                addStaticTeamMembers();

            } catch (error) {
                console.error('Error loading team members:', error);
                loadingTeam.innerHTML = '<p class="text-danger">Fel vid hämtning av teammedlemmar</p>';
                
                // Still show static members
                addStaticTeamMembers();
            }
        }

        function addStaticTeamMembers() {
            const teamContainer = document.getElementById('teamContainer');
            
            // Your existing static team members
            const staticMembers = [
                {
                    name: 'Axel Lindström',
                    position: 'Frontend Developer',
                    location: 'Stockholm',
                    image: 'axel/pictures/Gamingmix2.png',
                    link: 'axel/index.html'
                },
                {
                    name: 'Elias Gustafsson',
                    position: 'Backend Developer',
                    location: 'Göteborg',
                    image: 'elias/image.jpg',
                    link: 'elias/elias.html'
                },
                {
                    name: 'Olle Tidblom',
                    position: 'UI/UX Designer',
                    location: 'Malmö',
                    image: 'olle/images/glad.JPG',
                    link: 'olle/olle.html'
                },
                {
                    name: 'Baptiste Morel',
                    position: 'UI/UX Designer',
                    location: 'Malmö',
                    image: 'bapt/assets/BaptPP.JPG',
                    link: 'bapt/bapt.html'
                },
                {
                    name: 'Joakim Bengtsson',
                    position: 'UI/UX Designer',
                    location: 'Malmö',
                    image: 'joakim/IMG_20240105_142150_573.jpg',
                    link: 'joakim/cv.html'
                }
            ];

            staticMembers.forEach(member => {
                const memberCard = createTeamCard(member, false);
                teamContainer.appendChild(memberCard);
            });
        }

        function createTeamCard(member, isFromDatabase = false) {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';
            
            const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
            
            if (isFromDatabase) {
                col.innerHTML = `
                    <div class="card team-card h-100">
                        <div class="card-body text-center p-4">
                            <img src="${member.avatar_url || defaultAvatar}" 
                                 alt="${member.name}" class="rounded mx-auto d-block mb-3 img-fluid"
                                 onerror="this.src='${defaultAvatar}'">
                            <h5 class="card-title">${member.name}</h5>
                            <p class="role mb-1">${member.position || 'Team Member'}</p>
                            <p class="text-muted mb-3">${member.location || ''}</p>
                            ${member.bio ? `<p class="small text-muted mb-3">${member.bio}</p>` : ''}
                            ${member.email ? `<p class="small mb-3"><i class="fas fa-envelope me-1"></i>${member.email}</p>` : ''}
                            <button class="btn like-button" onclick="toggleLike(this)">
                                <i class="fas fa-heart"></i>
                                <span>0</span>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                col.innerHTML = `
                    <div class="card team-card h-100">
                        <div class="card-body text-center p-4">
                            <a href="${member.link}" class="team-image-link">
                                <img src="${member.image}" 
                                     alt="${member.name}" class="rounded mx-auto d-block mb-3 img-fluid">
                            </a>
                            <h5 class="card-title">
                                <a href="${member.link}" class="team-name-link">${member.name}</a>
                            </h5>
                            <p class="role mb-1">${member.position}</p>
                            <p class="text-muted mb-3">${member.location}</p>
                            <button class="btn like-button" onclick="toggleLike(this)">
                                <i class="fas fa-heart"></i>
                                <span>0</span>
                            </button>
                        </div>
                    </div>
                `;
            }
            
            return col;
        }

        async function handleAddMember(e) {
            e.preventDefault();
            
            if (!currentUser) {
                showMessage('Du måste vara inloggad för att lägga till teammedlemmar', 'warning');
                return;
            }
            
            const name = document.getElementById('memberName').value;
            const position = document.getElementById('memberPosition').value;
            const email = document.getElementById('memberEmail').value;
            const location = document.getElementById('memberLocation').value;
            const bio = document.getElementById('memberBio').value;
            const avatar_url = document.getElementById('memberAvatar').value;
            
            if (!name) {
                showMessage('Namn är obligatoriskt', 'warning');
                return;
            }
            
            try {
                const { data, error } = await supabase
                    .from('team_members')
                    .insert([
                        {
                            name: name,
                            position: position,
                            email: email,
                            location: location,
                            bio: bio,
                            avatar_url: avatar_url
                        }
                    ])
                    .select();

                if (error) throw error;

                showMessage('Teammedlem tillagd!', 'success');
                document.getElementById('addMemberForm').reset();
                loadTeamMembers(); // Reload team members
                
            } catch (error) {
                showMessage('Fel vid tillägg av teammedlem: ' + error.message, 'danger');
            }
        }

        // Utility Functions
        function showMessage(message, type = 'info') {
            const messagesContainer = document.getElementById('messages');
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} alert-dismissible fade show`;
            alert.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            messagesContainer.appendChild(alert);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }


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