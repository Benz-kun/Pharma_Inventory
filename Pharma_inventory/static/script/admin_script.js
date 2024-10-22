function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(section).style.display = 'block';

    // Reset buttons and results
    if (section === 'home') {
        document.getElementById('medicinesTable').style.display = 'none';
        document.getElementById('generateButton').style.display = 'none';
        document.getElementById('result').innerHTML = '';
    }
}

// Fetch button functionality
document.getElementById('fetchButton').addEventListener('click', () => {
    document.getElementById('medicinesTable').style.display = 'table';
    document.getElementById('generateButton').style.display = 'block';
});

// Generate button functionality
document.getElementById('generateButton').addEventListener('click', () => {
    document.getElementById('result').innerHTML = 'Here some data is supposed to be displayed';
});

document.getElementById('pharmacySelect').addEventListener('change', function() {
    const selectedPharmacy = this.value;
    fetchSalesData(selectedPharmacy); // Call to fetch sales data
    updateSalesTable(); // This can be removed if only sales data is to be fetched
});


// Function to update the sales table based on selected pharmacy
function updateSalesTable() {
    const pharmacy = document.getElementById('pharmacySelect').value;
    const salesTable = document.getElementById('salesTable');
    const rows = salesTable.querySelectorAll('tbody tr');

    rows.forEach(row => {
        row.style.display = pharmacy && row.classList.contains(pharmacy) ? '' : 'none';
    });

    salesTable.style.display = pharmacy ? 'table' : 'none';
}

// Function to update the inventory table based on selected pharmacy
function updateInventoryTable() {
    const pharmacy = document.getElementById('inventoryPharmacySelect').value;
    const inventoryTable = document.getElementById('inventoryTable');
    const rows = inventoryTable.querySelectorAll('tbody tr');

    rows.forEach(row => {
        row.style.display = pharmacy && row.classList.contains(pharmacy) ? '' : 'none';
    });

    inventoryTable.style.display = pharmacy ? 'table' : 'none';
}

// Load the home section by default
window.onload = function() {
    showSection('home');
    // Add event listeners for dropdowns
    document.getElementById('pharmacySelect').addEventListener('change', updateSalesTable);
    document.getElementById('inventoryPharmacySelect').addEventListener('change', updateInventoryTable);
};

function showEntityForm() {
    const entityType = document.getElementById('entityType').value;
    const formContainer = document.getElementById('entityFormContainer');
    formContainer.innerHTML = ''; // Clear previous content

    if (entityType === "Admin" || entityType === "Manager") {
        formContainer.innerHTML = `
            <form id="entityForm">
                <label for="user_id">User ID:</label>
                <input type="text" id="user_id" name="user_id" required><br><br>

                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required><br><br>

                <label for="phone_number">Phone Number:</label>
                <input type="text" id="phone_number" name="phone_number" required><br><br>

                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br><br>

                <button type="button" id="entityadd" onclick="addEntity('${entityType}')">Add</button>
            </form>
            <p id="formMessage" style="color: red;"></p>
        `;
    }
}

function addEntity(entityType) {
    const userId = document.getElementById('user_id').value.trim();
    const username = document.getElementById('username').value.trim();
    const phoneNumber = document.getElementById('phone_number').value.trim();
    const password = document.getElementById('password').value.trim();
    const formMessage = document.getElementById('formMessage');

    // Check if all fields are filled
    if (!userId || !username || !phoneNumber || !password) {
        formMessage.textContent = "Please fill in all fields.";
        return;
    }

    // Determine the admin value based on the entity type
    const isAdmin = entityType === "Admin" ? 1 : 0;

    // Send data to the server
    fetch('/add_entity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            username: username,
            phone_number: phoneNumber,
            password: password,
            admin: isAdmin
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            formMessage.style.color = "green";
            formMessage.textContent = "Entity added successfully!";
            document.getElementById('entityForm').reset();
        } else {
            formMessage.style.color = "red";
            formMessage.textContent = data.error || "Failed to add entity.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        formMessage.textContent = "An error occurred. Please try again.";
    });
}