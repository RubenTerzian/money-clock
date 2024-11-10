let income = 0;
let incomeType = 'hourly';
let secondsElapsed = 0;
let moneyEarned = 0;
let incomeStartTime = 0; // Time when income was last updated
let intervalId = null;
let isRunning = false; // Flag to track if the stopwatch is running

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
const startStopIcon = document.getElementById('startStopIcon');

// Load saved state from localStorage
function loadState() {
    const savedIncome = localStorage.getItem('income');
    const savedIncomeType = localStorage.getItem('incomeType');
    const savedEarnings = localStorage.getItem('moneyEarned');
    const savedElapsedTime = localStorage.getItem('secondsElapsed');
    const savedIncomeStartTime = localStorage.getItem('incomeStartTime');

    if (savedIncome && savedIncomeType && savedEarnings && savedElapsedTime) {
        income = parseFloat(savedIncome);
        incomeType = savedIncomeType;
        moneyEarned = parseFloat(savedEarnings);
        secondsElapsed = parseInt(savedElapsedTime);
        incomeStartTime = parseInt(savedIncomeStartTime);
        updateDisplay();
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('income', income);
    localStorage.setItem('incomeType', incomeType);
    localStorage.setItem('moneyEarned', moneyEarned);
    localStorage.setItem('secondsElapsed', secondsElapsed);
    localStorage.setItem('incomeStartTime', incomeStartTime);
}

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

    saveState(); // Save state regularly
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
    isRunning = true; // Set running flag
    intervalId = setInterval(() => {
        secondsElapsed++;
        timeElapsedDisplay.textContent = formatTime(secondsElapsed);
        calculateEarnings();
    }, 1000);
    startStopIcon.textContent = 'pause'; // Change icon to 'pause' when running
}

// Stop the stopwatch
function stopStopwatch() {
    isRunning = false; // Set running flag to false
    clearInterval(intervalId);
    startStopIcon.textContent = 'play_arrow'; // Change icon to 'play' when stopped
}

// Toggle the stopwatch when the start/stop button is clicked
startStopIcon.addEventListener('click', () => {
    if (isRunning) {
        stopStopwatch(); // Stop if it's running
    } else {
        startStopwatch(); // Start if it's stopped
    }
});

// Update the display with current earnings and time
function updateDisplay() {
    earnedDisplay.textContent = `$${moneyEarned.toFixed(2)}`;
    timeElapsedDisplay.textContent = formatTime(secondsElapsed);
    title.textContent = `$${moneyEarned.toFixed(2)}`;
}

// Event listener to start stopwatch when the user enters income
startBtn.addEventListener('click', () => {
    income = parseFloat(incomeInput.value);
    incomeType = incomeTypeSelect.value;
    if (isNaN(income)) {
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
    isRunning = false; // Reset running flag
    startStopIcon.textContent = 'play_arrow'; // Set the icon back to 'play'
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

// Load saved state when the page loads
window.onload = function() {
    loadState();

    // If no income has been set, show the income modal
    if (income === 0) {
        incomeModal.style.display = 'block';
    } else {
        // If income has been set, start the stopwatch and show the current state
        startStopwatch();
    }
};

// Save state when the page is closed or refreshed
window.onbeforeunload = function() {
    saveState();
};
