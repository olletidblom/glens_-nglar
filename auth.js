// IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://tvbqvrklhlriyksknynj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF2cmtsaGxyaXlrc2tueW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzY3NDMsImV4cCI6MjA3MjkxMjc0M30.Sx_e9aREKhWROBJeYwNztiK98kLxiiQWBJBwXObOrh8';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

async function checkAuth() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // User is already logged in, redirect to main page
            showMessage('Du är redan inloggad. Omdirigerar...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

async function signUp() {
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!email || !password || !confirmPassword) {
        showMessage('Vänligen fyll i alla fält', 'warning');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Lösenorden matchar inte', 'warning');
        return;
    }

    if (password.length < 6) {
        showMessage('Lösenordet måste vara minst 6 tecken', 'warning');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error;

        showMessage('Konto skapat! Kontrollera din e-post för att verifiera kontot.', 'success');
        showSignIn();
        
        // Clear form
        document.getElementById('signUpEmail').value = '';
        document.getElementById('signUpPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
    } catch (error) {
        showMessage('Fel vid registrering: ' + error.message, 'danger');
    }
}

async function signIn() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Vänligen fyll i alla fält', 'warning');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        showMessage('Inloggning lyckades! Omdirigerar...', 'success');
        
        // Redirect to main page after successful login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        showMessage('Fel vid inloggning: ' + error.message, 'danger');
    }
}

function showSignUp() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signUpForm').classList.remove('hidden');
    document.getElementById('authTitle').textContent = 'Skapa konto';
    document.querySelector('.text-muted').textContent = 'Bli en del av teamet!';
}

function showSignIn() {
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('authTitle').textContent = 'Logga in';
    document.querySelector('.text-muted').textContent = 'Välkommen tillbaka!';
}

function showMessage(message, type = 'info') {
    const messagesContainer = document.getElementById('messages');
    
    // Clear previous messages
    messagesContainer.innerHTML = '';
    
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

// Handle Enter key press in forms
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const loginForm = document.getElementById('loginForm');
        const signUpForm = document.getElementById('signUpForm');
        
        if (!loginForm.classList.contains('hidden')) {
            signIn();
        } else if (!signUpForm.classList.contains('hidden')) {
            signUp();
        }
    }
});