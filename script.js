// DOM-elementer
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// Initialiser applikasjonen
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
});

// Navigasjonsfunksjonalitet
function initializeNavigation() {
    // Mobilmeny-veksling
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Lukk mobilmeny når man klikker på en lenke
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Lukk mobilmeny når man klikker utenfor
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Jevn rulling for navigasjonslenker
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Juster for fast navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Rulleeffekter
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        // Oppdater aktiv navigasjonslenke
        updateActiveNavLink();
    });
}

// Oppdater aktiv navigasjonslenke basert på rulleposisjon
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

// Legg til CSS-animasjonsstiler dynamisk
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--primary-color);
            background-color: var(--gray-50);
        }
        
        body.nav-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Kontaktskjemafunksjonalitet
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hent skjemadata
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Valider skjema
        if (validateContactForm(data)) {
            submitContactForm(data);
        }
    });
    
    // Sanntidsvalidering
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Valider kontaktskjema
function validateContactForm(data) {
    let isValid = true;
    
    // Påkrevde felt
    const requiredFields = ['company', 'name', 'email'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'Dette feltet er påkrevd');
            isValid = false;
        }
    });
    
    // E-postvalidering
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Vennligst oppgi en gyldig e-postadresse');
        isValid = false;
    }
    
    return isValid;
}

// Valider individuelt felt
function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(name, 'Dette feltet er påkrevd');
        return false;
    }
    
    if (name === 'email' && value && !isValidEmail(value)) {
        showFieldError(name, 'Vennligst oppgi en gyldig e-postadresse');
        return false;
    }
    
    return true;
}

// Vis feltfeil
function showFieldError(fieldName, message) {
    const field = contactForm.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    field.classList.add('error');
    
    // Fjern eksisterende feilmelding
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Legg til feilmelding
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 4px;
        display: block;
    `;
    
    field.parentElement.appendChild(errorElement);
    
    // Legg til feilstiler
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
}

// Fjern feltfeil
function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// E-postvalidering
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Send kontaktskjema
function submitContactForm(data) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Vis lastestatus
    submitButton.innerHTML = 'Sender...';
    submitButton.disabled = true;
    
    // Simuler skjemainnsending (erstatt med faktisk API-kall)
    setTimeout(() => {
        // Vis suksessmelding
        showNotification('Takk for din melding! Vi tar kontakt snart.', 'success');
        
        // Nullstill skjema
        contactForm.reset();
        
        // Nullstill knapp
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // I en ekte applikasjon ville du sendt dataene til backend:
        console.log('Form data to submit:', data);
        
    }, 1500);
}

// Vis varsling
function showNotification(message, type = 'info') {
    // Fjern eksisterende varslinger
    document.querySelectorAll('.notification').forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    document.body.appendChild(notification);
    
    // Glid inn
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Lukk-knappfunksjonalitet
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Lukk automatisk etter 5 sekunder
    setTimeout(() => {
        closeNotification(notification);
    }, 4000);
}

// Lukk varsling
function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// E-postvalidering
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialiser stiler
addAnimationStyles();

// Konsollmelding for utviklere
console.log(`
🚀 Hei utvikler! 

Dette er porteføljen til Gruppe 8.
Hvis du er interessert i å samarbeide med oss, 
ta gjerne kontakt!

Mvh,
Gruppe 8 💻
`);
