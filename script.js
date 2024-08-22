console.log("script.js loaded...");

let hourlyWage = 0;
let earnings = 0;
let elapsedTime = 0;
let running = false;
let intervalId;

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function updateEarnings() {
    earnings = (elapsedTime / 3600) * hourlyWage;
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

// Handle form submission
function handleEditFormSubmit(event) {
    event.preventDefault();
    
    const newTitle = document.getElementById('titleInput').value;
    const newWage = parseFloat(document.getElementById('wageInput').value) || 0;
    
    if (newTitle) {
        document.querySelector('h1').innerText = newTitle;  // Change the title if a value is provided
    }
    
    hourlyWage = newWage;
    updateEarnings();  // Update earnings based on the new wage
    
    // Hide the modal after submission
    document.getElementById('editModal').style.display = 'none';
}

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