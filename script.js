console.log("script.js loaded...");

let hourlyWage = 0;
let earnings = 0;
let previousEarnings = 0;
let elapsedTime = 0;
let lastWageUpdateTime = 0; 
let running = false;
let intervalId;

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function updateEarnings() {
    // Earnings from before the last wage update
    const earningsBeforeUpdate = previousEarnings;
    
    // Earnings from after the last wage update
    const timeSinceLastUpdate = elapsedTime - lastWageUpdateTime;
    const earningsAfterUpdate = (timeSinceLastUpdate / 3600) * hourlyWage;

    // Total earnings is the sum of both
    earnings = earningsBeforeUpdate + earningsAfterUpdate;

    document.getElementById("earnings").innerText = `You have earned: $${earnings.toFixed(2)}`;
    document.title = `$${earnings.toFixed(2)}`;
}


function updateTimer() {
    document.getElementById("time").innerText = formatTime(elapsedTime);
}

function toggleTimer() {
    console.log("toggle timer clicked...");
    if (running) {
        clearInterval(intervalId);
        document.getElementById("playPauseButton").innerText = "Start";
    } else {
        intervalId = setInterval(() => {
            elapsedTime++;
            updateEarnings();
            updateTimer();
        }, 1000);
        document.getElementById("playPauseButton").innerText = "Pause";
    }
    running = !running;
}

// Show modal for editing information
function showEditModal() {
    document.getElementById('editModal').style.display = 'flex';
}

// Convert hourly wage to annual salary and update the corresponding field
function updateAnnualSalary() {
    const hourlyWage = parseFloat(document.getElementById('wageInput').value) || 0;
    const annualSalary = hourlyWage * 52 * 40;  // Assuming 40 hours per week and 52 weeks per year
    document.getElementById('annualSalaryInput').value = annualSalary.toFixed(2);
}

// Convert annual salary to hourly wage and update the corresponding field
function updateHourlyWage() {
    const annualSalary = parseFloat(document.getElementById('annualSalaryInput').value) || 0;
    const hourlyWage = annualSalary / (52 * 40);  // Assuming 40 hours per week and 52 weeks per year
    document.getElementById('wageInput').value = hourlyWage.toFixed(2);
}

// Handle form submission
function handleEditFormSubmit(event) {
    event.preventDefault();
    
    const newTitle = document.getElementById('titleInput').value;
    const newHourlyWage = parseFloat(document.getElementById('wageInput').value) || 0;
    const annualSalary = parseFloat(document.getElementById('annualSalaryInput').value) || 0;
    
    // Accumulate earnings based on the time since the last wage update
    const timeSinceLastUpdate = elapsedTime - lastWageUpdateTime;
    previousEarnings += (timeSinceLastUpdate / 3600) * hourlyWage;

    // Update the last wage update time
    lastWageUpdateTime = elapsedTime;

    if (newTitle) {
        document.querySelector('h1').innerText = newTitle;
    }
    
    if (annualSalary > 0) {
        hourlyWage = annualSalary / (52 * 40);
    } else {
        hourlyWage = newHourlyWage;
        updateAnnualSalary();
    }

    updateEarnings();  // Update earnings with the new wage

    // Hide the modal after submission
    document.getElementById('editModal').style.display = 'none';
}


// Add event listeners to input fields
document.getElementById('wageInput').addEventListener('input', updateAnnualSalary);
document.getElementById('annualSalaryInput').addEventListener('input', updateHourlyWage);


// Handle cancel button
function handleCancelButton() {
    document.getElementById('editModal').style.display = 'none';
}

// Set up event listeners
document.getElementById('editIncomeButton').addEventListener('click', showEditModal);
document.getElementById('editForm').addEventListener('submit', handleEditFormSubmit);
document.getElementById('cancelButton').addEventListener('click', handleCancelButton);


function resetEarnings() {
    const confirmReset = confirm("Are you sure you want to reset your earnings to 0?");
    if (confirmReset) {
        console.log("reset earnings confirmed...");
        previousEarnings = 0;  // Reset previous earnings
        earnings = 0;  // Reset current earnings
        elapsedTime = 0;  // Reset elapsed time
        updateEarnings();  // Update earnings display
        updateTimer();  // Reset timer display
    } else {
        console.log("reset earnings cancelled...");
    }
}
document.getElementById("resetButton").addEventListener("click", resetEarnings);




document.getElementById("playPauseButton").addEventListener("click", toggleTimer);
document.getElementById("editIncomeButton").addEventListener("click", editWage);
document.getElementById("resetButton").addEventListener("click", resetEarnings); 

updateEarnings();
updateTimer();