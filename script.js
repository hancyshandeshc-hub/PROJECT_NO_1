const form = document.getElementById("predictionForm");
const result = document.getElementById("result");
const predictButton = document.getElementById("predictButton");

// The FastAPI route is /predict, so the URL must end with it.
const API_URL = "https://project-no-1-60tm.onrender.com/predict";

// Free Render services can take about a minute to wake up after being idle.
const REQUEST_TIMEOUT_MS = 90000;


function getRainfallCategory(precipitation) {

    // Ranges are contiguous (using "<" upper bounds) so values such as
    // 0.05, 2.45 or 7.55 mm cannot fall through to "Very High Rainfall".

    if (precipitation < 0.1) {

        return {
            title: "No Rainfall",
            className: "no-rain",
            image: "images/no-rainfall.jpg",
            message:
                "Dry conditions are expected. This can be a good opportunity to conserve water and use available water resources responsibly."
        };

    }

    if (precipitation < 2.5) {

        return {
            title: "Very Low Rainfall",
            className: "very-low-rain",
            image: "images/very-low-rainfall.jpg",
            message:
                "Only a small amount of rainfall is expected. Consider conserving water and avoiding unnecessary water consumption."
        };

    }

    if (precipitation < 7.6) {

        return {
            title: "Low Rainfall",
            className: "low-rain",
            image: "images/low-rainfall.jpg",
            message:
                "Light rainfall is expected. Rainwater harvesting can help make useful use of limited rainfall."
        };

    }

    if (precipitation < 35.6) {

        return {
            title: "Moderate Rainfall",
            className: "moderate-rain",
            image: "images/moderate-rainfall.jpg",
            message:
                "Moderate rainfall is expected. Rainwater can support agriculture and replenish local water resources."
        };

    }

    if (precipitation < 64.5) {

        return {
            title: "High Rainfall",
            className: "high-rain",
            image: "images/high-rainfall.jpg",
            message:
                "Heavy rainfall is expected. Stay alert for waterlogging and possible disruptions, especially in vulnerable areas."
        };

    }

    return {
        title: "Very High Rainfall",
        className: "very-high-rain",
        image: "images/very-high-rainfall.jpg",
        message:
            "Very high rainfall is expected. Be alert to possible flooding, landslides and transportation disruptions. Follow local safety guidance."
    };
}


// Turns FastAPI error bodies into a readable message.
function getErrorMessage(json, status) {

    if (json && json.error) {
        return json.error;
    }

    // 422 validation errors arrive as { detail: [ { msg, loc, ... } ] }
    if (json && Array.isArray(json.detail)) {
        return json.detail.map(d => d.msg).join(", ");
    }

    if (json && typeof json.detail === "string") {
        return json.detail;
    }

    return `Prediction failed (server responded with status ${status}).`;
}


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    predictButton.disabled = true;

    predictButton.innerHTML = `
        <span class="loading-spinner"></span>
        Predicting...
    `;


    result.style.display = "block";

    result.innerHTML = `
        <div class="loading-result">
            <div class="big-loader"></div>
            <h3>Analyzing environmental conditions...</h3>
            <p>Please wait while our machine learning model makes the prediction. If the server was idle, the first request can take up to a minute.</p>
        </div>
    `;


    const data = {

        MONTH: parseInt(
            document.getElementById("month").value
        ),

        DISTRICT:
            document.getElementById("district").value,

        RH2M: parseFloat(
            document.getElementById("rh2m").value
        ),

        T2M: parseFloat(
            document.getElementById("t2m").value
        ),

        WS10M: parseFloat(
            document.getElementById("ws10m").value
        ),

        PS: parseFloat(
            document.getElementById("ps").value
        ),

        PRECTOT_LAST_MONTH: parseFloat(
            document.getElementById("lastRain").value
        ),

        RH2M_LAST_MONTH: parseFloat(
            document.getElementById("lastHumidity").value
        )

    };


    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);


    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data),

            signal: controller.signal
        });


        // The body may not be JSON (for example a Render error page).
        let json = null;

        try {
            json = await response.json();
        } catch (parseError) {
            json = null;
        }


        if (!response.ok) {

            throw new Error(
                getErrorMessage(json, response.status)
            );

        }


        const precipitation =
            parseFloat(json.prediction);


        const category =
            getRainfallCategory(precipitation);


        result.innerHTML = `

            <div class="result-card ${category.className}">

                <div class="result-image">

                    <img
                        src="${category.image}"
                        alt="${category.title}"
                        onerror="this.style.display='none'"
                    >

                </div>


                <div class="result-content">

                    <span class="result-label">
                        PREDICTED PRECIPITATION
                    </span>

                    <div class="precipitation-value">

                        ${precipitation.toFixed(2)}

                        <small>mm</small>

                    </div>


                    <div class="rainfall-category">

                        ${category.title}

                    </div>


                    <p class="awareness-message">

                        🌱 ${category.message}

                    </p>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(error);

        const message =
            error.name === "AbortError"
                ? "The server took too long to respond."
                : error.message;


        result.innerHTML = `

            <div class="error-result">

                <div>
                    ⚠️
                </div>

                <h3>
                    Prediction Unavailable
                </h3>

                <p>
                    ${message}
                </p>

                <small>
                    Please check your inputs and make sure
                    the prediction server is running.
                </small>

            </div>

        `;

    } finally {

        clearTimeout(timeoutId);

        predictButton.disabled = false;

        predictButton.innerHTML = `
            <span>
                Predict Rainfall
            </span>

            <span>
                →
            </span>
        `;

    }

});
