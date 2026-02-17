// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// DOM Elements
const passwordText = document.getElementById('passwordText');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthText = document.getElementById('strengthText');
const strengthBars = document.querySelectorAll('.strength-bar');

// Current password
let currentPassword = '';

// Event Listeners
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    if (currentPassword) {
        generatePassword();
    }
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// Add event listeners to checkboxes to regenerate password
[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (currentPassword) {
            generatePassword();
        }
    });
});

// Generate Password Function
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = '';
    let password = '';

    // Build character set based on selected options
    if (uppercaseCheck.checked) charset += UPPERCASE;
    if (lowercaseCheck.checked) charset += LOWERCASE;
    if (numbersCheck.checked) charset += NUMBERS;
    if (symbolsCheck.checked) charset += SYMBOLS;

    // Validate that at least one option is selected
    if (charset === '') {
        alert('Por favor, selecciona al menos una opción de caracteres.');
        return;
    }

    // Generate random password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    // Update UI
    currentPassword = password;
    passwordText.textContent = password;
    passwordText.classList.add('generated');
    
    // Add animation
    passwordText.parentElement.classList.add('generating');
    setTimeout(() => {
        passwordText.parentElement.classList.remove('generating');
    }, 500);

    // Update strength indicator
    updateStrength(password);
}

// Copy to Clipboard Function
async function copyToClipboard() {
    if (!currentPassword) {
        alert('Primero genera una contraseña.');
        return;
    }

    try {
        await navigator.clipboard.writeText(currentPassword);
        
        // Visual feedback
        copyBtn.classList.add('copied');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = originalHTML;
        }, 2000);
        
    } catch (err) {
        alert('Error al copiar la contraseña.');
        console.error('Error:', err);
    }
}

// Update Strength Indicator
function updateStrength(password) {
    let strength = 0;
    const length = password.length;
    
    // Calculate strength based on criteria
    if (length >= 12) strength++;
    if (length >= 16) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Normalize to 1-4 scale
    strength = Math.min(Math.ceil(strength / 1.5), 4);
    
    // Update bars
    strengthBars.forEach((bar, index) => {
        if (index < strength) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
    
    // Update text
    const strengthLabels = ['Débil', 'Media', 'Fuerte', 'Muy Fuerte'];
    strengthText.textContent = strengthLabels[strength - 1] || 'Muy Fuerte';
}

// Generate initial password on load
window.addEventListener('load', () => {
    generatePassword();
});
