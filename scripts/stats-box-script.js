// Fetch data from external file (e.g., JSON)
fetch('data/stats-box-data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('stats-data-container');

        // Iterate through data and add to container
        data.forEach(item => {
            const element = document.createElement('div');
            element.textContent = item.name; // Modify based on your data structure
            container.appendChild(element);
        });
    })
    .catch(error => console.error('Error loading data:', error));
