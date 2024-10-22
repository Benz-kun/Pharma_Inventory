// Function to show the selected section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
    });

    // Show the selected section
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
        sectionElement.style.display = 'block';
    }

    // Reset buttons and results
    if (section === 'home') {
        const medicinesTable = document.getElementById('medicinesTable');
        const generateButton = document.getElementById('generateButton');
        const result = document.getElementById('result');

        if (medicinesTable) medicinesTable.style.display = 'none';
        if (generateButton) generateButton.style.display = 'none';
        if (result) result.innerHTML = '';
    }
}

// Fetch button functionality
document.getElementById('fetchButton').addEventListener('click', () => {
    const prescriptionId = document.getElementById('prescriptionId').value;

    if (!prescriptionId) {
        alert('Please enter a Prescription ID');
        return;
    }

    fetch('/fetch_prescription_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prescription_id: prescriptionId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data received:', data); // Log the received data for debugging

        // Check if there is an error in the response
        if (data.error) {
            alert(data.error);
            document.getElementById('medicinesTable').style.display = 'none';
            return;
        }

        // Get the table body element
        const tableBody = document.getElementById('medicinesTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear previous table content

        // Check if the prescriptions array is not empty
        if (data.prescriptions.length === 0) {
            alert('No prescriptions found with the given ID.');
            document.getElementById('medicinesTable').style.display = 'none';
            return;
        }

        // Iterate through each prescription and create a new row in the table
        data.prescriptions.forEach(prescription => {
            const row = tableBody.insertRow();

            // Populate each cell with the corresponding prescription data
            row.insertCell(0).textContent = prescription.doctor_id || 'N/A';
            row.insertCell(1).textContent = prescription.patient_id || 'N/A';
            row.insertCell(2).textContent = prescription.medicine_name || 'N/A';
            row.insertCell(3).textContent = prescription.dosage || 'N/A';
            row.insertCell(4).textContent = prescription.frequency || 'N/A';
            row.insertCell(5).textContent = prescription.start_date || 'N/A';
            row.insertCell(6).textContent = prescription.end_date || 'N/A';
        });

        // Make sure the table is visible
        document.getElementById('medicinesTable').style.display = 'table';
        // Show the Generate Bill button
        document.getElementById('generateBillButton').style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching prescription data:', error);
        alert('An error occurred while fetching the data. Please try again.');
    });
});


// Add event listener for the Generate Bill button
// Add event listener for the Generate Bill button
document.getElementById('generateBillButton').addEventListener('click', () => {
    const prescriptionId = document.getElementById('prescriptionId').value;
    console.log('Prescription ID:', prescriptionId); // Log the prescription ID

    // Make a POST request to fetch bill details
    fetch('/fetch_bill_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prescription_id: prescriptionId })
    })
    .then(response => response.json()) // Convert response to JSON
    .then(data => {
        console.log('Data:', data); // Log the data

        if (data.error) {
            // If the response contains an error key, log it and show an alert
            console.warn('Error in response:', data.error);
            alert(data.error);
        } else if (data.bill && Array.isArray(data.bill) && data.bill.length > 0) {
            // If bill data exists and is an array with at least one item, populate the table
            populateBillTable(data.bill);
            document.getElementById('billTable').style.display = 'table';
            document.getElementById('totalCost').textContent = parseFloat(data.total_price).toFixed(2);
        } else {
            console.warn('No bill data found:', data);
            alert('No bill data found.');
        }
    })
    .catch(error => {
        console.error('Error fetching bill data:', error);
        alert('Failed to fetch bill data.');
    });
});

function populateBillTable(bill) {
    const tbody = document.getElementById('billTable').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    bill.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${String(item.medicine_name)}</td>
            <td>${String(item.dosage)}</td>
            <td>${String(item.quantity)}</td>
            <td>${String(parseFloat(item.cost_per_unit).toFixed(2))}</td>
        `;

        tbody.appendChild(row);
    });
}

