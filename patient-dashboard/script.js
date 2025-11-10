// Function to encode credentials for Basic Auth
function encodeCredentials(username, password) {
  return btoa(username + ":" + password);
}

// Function to fetch patient data
async function fetchPatientData() {
  const username = "coalition";
  const password = "skills-test";
  const encodedCredentials = encodeCredentials(username, password);

  try {
    const response = await fetch(
      "https://fedskillstest.coalitiontechnologies.workers.dev",
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + encodedCredentials,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to initialize the dashboard
async function initializeDashboard() {
  const patientData = await fetchPatientData();

  if (patientData && patientData.length > 0) {
    // Find Jessica Taylor's data
    const jessicaData = patientData.find(
      (patient) => patient.name === "Jessica Taylor"
    );

    if (jessicaData) {
      populatePatientInfo(jessicaData);
      createBloodPressureChart(jessicaData.diagnosis_history);
      populateDiagnosisHistory(jessicaData.diagnosis_history);
      populateDiagnosticList(jessicaData.diagnostic_list);
      populateLabResults(jessicaData.lab_results);
    }
  }
}

// Function to populate patient information
function populatePatientInfo(patient) {
  // Update basic info
  document.getElementById("patient-name").textContent = patient.name;
  document.getElementById(
    "patient-age-gender"
  ).textContent = `${patient.age} years, ${patient.gender}`;
  document.getElementById("patient-dob").textContent = `DOB: ${formatDate(
    patient.date_of_birth
  )}`;
  document.getElementById("patient-photo").src = patient.profile_picture;
  document.getElementById("patient-phone").textContent = patient.phone_number;
  document.getElementById("emergency-contact").textContent =
    patient.emergency_contact;
  document.getElementById("insurance-type").textContent =
    patient.insurance_type;

  // Update latest stats from diagnosis history
  if (patient.diagnosis_history && patient.diagnosis_history.length > 0) {
    const latestDiagnosis = patient.diagnosis_history[0];

    // Blood Pressure
    document.getElementById(
      "blood-pressure-value"
    ).textContent = `${latestDiagnosis.blood_pressure.systolic.value}/${latestDiagnosis.blood_pressure.diastolic.value}`;
    document.getElementById(
      "systolic-value"
    ).textContent = `${latestDiagnosis.blood_pressure.systolic.value}`;
    document.getElementById(
      "systolic-level"
    ).textContent = `${latestDiagnosis.blood_pressure.systolic.levels}`;
    document.getElementById(
      "diastolic-value"
    ).textContent = `${latestDiagnosis.blood_pressure.diastolic.value}`;
    document.getElementById(
      "diastolic-level"
    ).textContent = `${latestDiagnosis.blood_pressure.diastolic.levels}`;

    // Heart Rate
    document.getElementById(
      "heart-rate-value"
    ).textContent = `${latestDiagnosis.heart_rate.value} bpm`;
    document.getElementById(
      "heart-rate-level"
    ).textContent = `${latestDiagnosis.heart_rate.levels}`;

    // Respiratory Rate
    document.getElementById(
      "respiratory-rate-value"
    ).textContent = `${latestDiagnosis.respiratory_rate.value} bpm`;
    document.getElementById(
      "respiratory-rate-level"
    ).textContent = `${latestDiagnosis.respiratory_rate.levels}`;

    // Temperature
    document.getElementById(
      "temperature-value"
    ).textContent = `${latestDiagnosis.temperature.value}°F`;
    document.getElementById(
      "temperature-level"
    ).textContent = `${latestDiagnosis.temperature.levels}`;
  }
}

// Function to create blood pressure chart
function createBloodPressureChart(diagnosisHistory) {
  const ctx = document.getElementById("bloodPressureChart").getContext("2d");

  // Extract data for chart - reverse to show chronological order
  const reversedHistory = [...diagnosisHistory].reverse();
  const months = reversedHistory.map((d) => `${d.month} ${d.year}`);
  const systolic = reversedHistory.map((d) => d.blood_pressure.systolic.value);
  const diastolic = reversedHistory.map(
    (d) => d.blood_pressure.diastolic.value
  );

  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Systolic",
          data: systolic,
          borderColor: "#072635",
          backgroundColor: "rgba(7, 38, 53, 0.1)",
          tension: 0.4,
          fill: false,
          borderWidth: 2,
        },
        {
          label: "Diastolic",
          data: diastolic,
          borderColor: "#01F0D0",
          backgroundColor: "rgba(1, 240, 208, 0.1)",
          tension: 0.4,
          fill: false,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: "'Manrope', sans-serif",
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(0,0,0,0.1)",
          },
          ticks: {
            font: {
              family: "'Manrope', sans-serif",
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "'Manrope', sans-serif",
            },
          },
        },
      },
    },
  });
}

// Function to populate diagnosis history
function populateDiagnosisHistory(diagnosisHistory) {
  const container = document.getElementById("diagnosis-history-content");
  container.innerHTML = "";

  if (diagnosisHistory && diagnosisHistory.length > 0) {
    // Show only the 3 most recent diagnoses
    diagnosisHistory.slice(0, 3).forEach((diagnosis) => {
      const diagnosisItem = document.createElement("div");
      diagnosisItem.className = "diagnosis-item";

      diagnosisItem.innerHTML = `
                <div class="diagnosis-month">${diagnosis.month} ${diagnosis.year}</div>
                <div class="diagnosis-details">
                    <div>
                        <strong>Blood Pressure:</strong> ${diagnosis.blood_pressure.systolic.value}/${diagnosis.blood_pressure.diastolic.value}
                    </div>
                    <div>
                        <strong>Heart Rate:</strong> ${diagnosis.heart_rate.value} bpm
                    </div>
                    <div>
                        <strong>Respiratory:</strong> ${diagnosis.respiratory_rate.value} bpm
                    </div>
                    <div>
                        <strong>Temperature:</strong> ${diagnosis.temperature.value}°F
                    </div>
                </div>
            `;

      container.appendChild(diagnosisItem);
    });
  } else {
    container.innerHTML = "<p>No diagnosis history available</p>";
  }
}

// Function to populate diagnostic list
function populateDiagnosticList(diagnosticList) {
  const container = document.getElementById("diagnostic-list-content");
  container.innerHTML = "";

  if (diagnosticList && diagnosticList.length > 0) {
    diagnosticList.forEach((diagnostic) => {
      const diagnosticItem = document.createElement("div");
      diagnosticItem.className = "diagnostic-item";

      const statusClass =
        diagnostic.status === "Under Observation"
          ? "status-observation"
          : "status-current";

      diagnosticItem.innerHTML = `
                <div class="diagnostic-name">${diagnostic.name}</div>
                <div class="diagnostic-description">${diagnostic.description}</div>
                <span class="diagnostic-status ${statusClass}">${diagnostic.status}</span>
            `;

      container.appendChild(diagnosticItem);
    });
  } else {
    container.innerHTML = "<p>No diagnostic list available</p>";
  }
}

function populateLabResults(labResults) {
  const container = document.getElementById("lab-results-content");
  container.innerHTML = "";

  if (labResults && labResults.length > 0) {
    labResults.forEach((lab) => {
      const labItem = document.createElement("div");
      labItem.className = "lab-item";
      labItem.textContent = lab;
      container.appendChild(labItem);
    });
  } else {
    container.innerHTML = "<p>No lab results available</p>";
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

document.addEventListener("DOMContentLoaded", initializeDashboard);
