let income = 0;
let incomeType = 'hourly';
let secondsElapsed = 0;
let moneyEarned = 0;
let incomeStartTime = 0; // Time when income was last updated
let intervalId = null;

const earnedDisplay = document.getElementById('earned');
const timeElapsedDisplay = document.getElementById('timeElapsed');
const title = document.querySelector('title');

// Modal Elements
const incomeModal = document.getElementById('incomeModal');
const settingsModal = document.getElementById('settingsModal');
const incomeInput = document.getElementById('incomeInput');
const incomeTypeSelect = document.getElementById('incomeType');
const startBtn = document.getElementById('startBtn');
const incomeEdit = document.getElementById('incomeEdit');
const incomeTypeEdit = document.getElementById('incomeTypeEdit');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const settingsIcon = document.getElementById('settingsIcon');

// Open income modal on page load
window.onload = function() {
    incomeModal.style.display = 'block';
};

// Function to calculate hourly rate based on income type
function getHourlyRate() {
    return incomeType === 'hourly' ? income : income / 2080; // Convert annual to hourly
}

// Function to calculate earnings since last income update
function calculateEarnings() {
    let currentTime = secondsElapsed;
    let timeSinceLastUpdate = currentTime - incomeStartTime; // Time since last income change
    let hourlyRate = getHourlyRate();

    // Only add money earned since last income change
    moneyEarned += (hourlyRate * (timeSinceLastUpdate / 3600));
    incomeStartTime = currentTime; // Reset the start time after update

    // Update display
    earnedDisplay.textContent = `$${moneyEarned.toFixed(2)}`;
    title.textContent = `$${moneyEarned.toFixed(2)}`;
}

// Function to format time
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start the stopwatch
function startStopwatch() {
    intervalId = setInterval(() => {
        secondsElapsed++;
        timeElapsedDisplay.textContent = formatTime(secondsElapsed);
        calculateEarnings();
    }, 1000);
}

// Event listener to start stopwatch when the user enters income
startBtn.addEventListener('click', () => {
    income = parseFloat(incomeInput.value);
    incomeType = incomeTypeSelect.value;
    if (isNaN(income) || income <= 0) {
        alert('Please enter a valid income.');
    } else {
        incomeModal.style.display = 'none';
        incomeStartTime = 0; // Reset income start time when starting
        startStopwatch();
    }
});

// Event listener to open settings modal
settingsIcon.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    incomeEdit.value = income;
    incomeTypeEdit.value = incomeType;
});

// Event listener to save new income without resetting earnings
saveBtn.addEventListener('click', () => {
    const newIncome = parseFloat(incomeEdit.value);
    const newIncomeType = incomeTypeEdit.value;
    
    if (isNaN(newIncome) || newIncome <= 0) {
        alert('Please enter a valid income.');
    } else {
        // Calculate the money earned so far with the previous income rate before changing it
        calculateEarnings();

        // Now update the income and income type
        income = newIncome;
        incomeType = newIncomeType;

        // Reset the incomeStartTime to prevent retroactive changes
        incomeStartTime = secondsElapsed;

        settingsModal.style.display = 'none';
    }
});

// Event listener to reset the stopwatch
resetBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    secondsElapsed = 0;
    moneyEarned = 0;
    earnedDisplay.textContent = '$0.00';
    timeElapsedDisplay.textContent = '00:00:00';
    title.textContent = '$0.00';
    settingsModal.style.display = 'none';
    incomeStartTime = 0; // Reset income start time
    startStopwatch();
});

// Close modal on click outside content
window.onclick = function(event) {
    if (event.target === incomeModal) {
        incomeModal.style.display = 'none';
    }
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
};
