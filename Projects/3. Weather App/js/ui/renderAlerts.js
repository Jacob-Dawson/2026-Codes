// renders the weather alerts

export function renderAlerts(alerts){

    const container = document.querySelector("#weather-warning");

    // guard clause
    if(!Array.isArray(alerts) || alerts.length === 0){

        container.innerHTML = "";
        container.style.display = "none";
        return;

    }

    container.style.display = "block";

    container.innerHTML = `
        <h3>⚠️ Weather Alerts ⚠️</h3>
        <div id="alerts-wrapper">
            ${alerts.map(alert => createAlertHTML(alert)).join("")}
        </div>`
}

function createAlertHTML(alert){

    //guard clause
    if(!alert){

        return `
            <div class="alert-card">
                <p>Alert data unavailable</p>
            </div>`

    }

    // fallbacks
    const headline = alert.headline ?? "No headline"
    const event = alert.event ?? "Unknown event"
    const severity = alert.severity ?? "unknown"
    const severityClass = severity.toLowerCase?.() || "unknown"
    const description = alert.desc ?? ""
    const instruction = alert.instruction ?? "No instructions provided"

    return `
        <div class="alert-card ${severityClass}">
            <h4>${headline}</h4>
            <p><strong>Event:</strong> ${event}</p>
            <p><strong>Severity:</strong> ${severity}</p>
            <p>${description}</p>
            <p><strong>Advice:</strong> ${instruction}</p>
        </div>
    `

}