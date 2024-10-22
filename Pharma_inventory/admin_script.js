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