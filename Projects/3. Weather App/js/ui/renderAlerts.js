// renders the weather alerts

export function renderAlerts(alerts){

    //console.log(alerts)

    const container = document.querySelector("#weather-warning");

    if(!alerts || alerts.length === 0){

        container.innerHTML = "";
        container.style.display = "none";
        return;

    }

    container.style.display = "block";
    container.innerHTML = `
        <h3>⚠️ Weather Alerts ⚠️</h3>
        <div id="#alerts-wrapper"
            ${alerts.map(alert => `
                <div class="alert-card ${alert.severity.toLowerCase()}">
                    <h4>${alert.headline}</h4>
                    <p><strong>Event:</strong> ${alert.event}</p>
                    <p><strong>Severity:</strong> ${alert.severity}</p>
                    <p>${alert.dsec || ""}</p>
                    <p><strong>Advice:</strong> ${alert.instruction || "No instructions provided"}</p>
                </div>
            `).join("")}
        </div>`
}