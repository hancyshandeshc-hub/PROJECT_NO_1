// Get form and result container
const form = document.getElementById('predictionForm');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent page reload

    // Collect data from form inputs
    const data = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        year: parseInt(document.getElementById('year').value),
        kms_driven: parseInt(document.getElementById('kms_driven').value)
    };

    try {
        // Send POST request to FastAPI
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();

        // Show prediction or error
        result.style.display = "block";
        if(response.ok){
            result.textContent = `Predicted Price: ${json.prediction}`;
        } else {
            result.textContent = `Error: ${json.error}`;
        }

    } catch (error) {
        // Handle network errors
        result.style.display = "block";
        result.textContent = `Network Error: ${error}`;
    }
});