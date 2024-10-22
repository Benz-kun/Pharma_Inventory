const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');
const pharmaLoginButton = document.querySelector('#pharma-login');
const adminLoginButton = document.querySelector('#admin-login');

const pharmaUsername = document.querySelector('#pharma-username');
const pharmaPhone = document.querySelector('#pharma-phone');
const pharmaPassword = document.querySelector('#pharma-password');

const adminUsername = document.querySelector('#admin-username');
const adminPhone = document.querySelector('#admin-phone');
const adminPassword = document.querySelector('#admin-password');

// Enable login button only if all fields are filled
const checkFieldsFilled = (username, phone, password, button) => {
    if (username.value && phone.value && password.value) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
};

// Event listeners for checking fields
[pharmaUsername, pharmaPhone, pharmaPassword].forEach(input => {
    input.addEventListener('input', () => checkFieldsFilled(pharmaUsername, pharmaPhone, pharmaPassword, pharmaLoginButton));
});

[adminUsername, adminPhone, adminPassword].forEach(input => {
    input.addEventListener('input', () => checkFieldsFilled(adminUsername, adminPhone, adminPassword, adminLoginButton));
});

// Switching between login forms
registerLink.onclick = () => {
    wrapper.classList.add('active');
};

loginLink.onclick = () => {
    wrapper.classList.remove('active');
};

// Pharma Manager login
pharmaLoginButton.onclick = async () => {
    const response = await fetch('/validate_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: pharmaUsername.value,
            phone_number: pharmaPhone.value,
            password: pharmaPassword.value,
            admin: 0 // Manager login
        })
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = '/index2';
    } else {
        alert(result.message);
    }
};

// Admin login
adminLoginButton.onclick = async () => {
    const response = await fetch('/validate_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: adminUsername.value,
            phone_number: adminPhone.value,
            password: adminPassword.value,
            admin: 1 // Admin login
        })
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = '/admin_page';
    } else {
        alert(result.message);
    }
};
