// Theme switching functionality
const themeSwitch = document.getElementById('themeSwitch');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeSwitch.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme ? savedTheme === 'dark' : prefersDark.matches);

themeSwitch.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') !== 'light';
    setTheme(!isDark);
});

// Loading state handler
function setLoading(button, isLoading) {
    button.setAttribute('data-loading', isLoading);
    button.classList.toggle('loading', isLoading);
}

// Form validation and submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('invalid');
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        setLoading(submitBtn, true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(submitBtn, false);
        alert('Message sent successfully!');
        contactForm.reset();
    });
}

// Button click handlers with loading states
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        setLoading(loginBtn, true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(loginBtn, false);
    });
}

const appStoreBtn = document.getElementById('appStoreBtn');
const googlePlayBtn = document.getElementById('googlePlayBtn');

[appStoreBtn, googlePlayBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', async () => {
            setLoading(btn, true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(btn, false);
        });
    }
});

// Update card balances from budget data
function updateCardBalances() {
    const savedExpenses = localStorage.getItem('expenses');
    const savedIncomes = localStorage.getItem('incomes');
    
    let totalExpenses = 0;
    let totalIncome = 0;
    
    if (savedExpenses) {
        const expenses = JSON.parse(savedExpenses);
        totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
    
    if (savedIncomes) {
        const incomes = JSON.parse(savedIncomes);
        totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    }
    
    const balance = totalIncome - totalExpenses;
    
    // Update card balances
    const cards = document.querySelectorAll('.card .balance');
    if (cards.length >= 2) {
        cards[0].textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(totalIncome);
        
        cards[1].textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(balance);
    }
}

// Update balances when page loads
document.addEventListener('DOMContentLoaded', updateCardBalances);

// Page redirection function
function redirectToPage(page) {
    window.location.href = `${page}.html`;
}

// Mobile responsiveness
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token
            if (rememberMe) {
                localStorage.setItem('token', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
            }
            
            // Redirect to main page
            window.location.href = 'wealthmate.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

// Function to check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Function to protect routes
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}