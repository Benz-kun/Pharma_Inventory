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

// Load the home section by default
// window.onload = function() {
//     showSection('home');
// };
