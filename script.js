let income = 0;
let incomeType = 'hourly';
let secondsElapsed = 0;
let moneyEarned = 0;
let incomeStartTime = 0; // Time when income was last updated
let intervalId = null;
let isRunning = false; // Flag to track if the stopwatch is running
let lastSavedTime = 0; // To track when the page was last saved

const earnedDisplay = document.getElementById('earned');
const timeElapsedDisplay = document.getElementById('timeElapsed');
const startStopIcon = document.getElementById('startStopIcon');
const incomeInput = document.getElementById('incomeInput');
const incomeTypeInput = document.getElementById('incomeType');
const startBtn = document.getElementById('startBtn');
const incomeModal = document.getElementById('incomeModal');
const settingsIcon = document.getElementById('settingsIcon');
const settingsModal = document.getElementById('settingsModal');
const incomeEdit = document.getElementById('incomeEdit');
const incomeTypeEdit = document.getElementById('incomeTypeEdit');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

// Save state to localStorage
function saveState() {
    localStorage.setItem('income', income);
    localStorage.setItem('incomeType', incomeType);
    localStorage.setItem('moneyEarned', moneyEarned);
    localStorage.setItem('secondsElapsed', secondsElapsed);
    localStorage.setItem('incomeStartTime', incomeStartTime);
    localStorage.setItem('lastSavedTime', Date.now()); // Save the current timestamp as last saved time
    localStorage.setItem('isRunning', isRunning);
}

// Set an interval to save the state every 1 second(s)
const saveIntervalId = setInterval(saveState, 1000);

// Load saved state from localStorage
function loadState() {
    const savedIncome = localStorage.getItem('income');
    const savedIncomeType = localStorage.getItem('incomeType');
    const savedEarnings = localStorage.getItem('moneyEarned');
    const savedElapsedTime = localStorage.getItem('secondsElapsed');
    const savedIncomeStartTime = localStorage.getItem('incomeStartTime');
    const savedLastSavedTime = localStorage.getItem('lastSavedTime');
    const savedIsRunning = localStorage.getItem('isRunning');

    if (savedIncome && savedIncomeType && savedEarnings && savedElapsedTime) {
        income = parseFloat(savedIncome);
        incomeType = savedIncomeType;
        moneyEarned = parseFloat(savedEarnings);
        secondsElapsed = parseInt(savedElapsedTime);
        incomeStartTime = parseInt(savedIncomeStartTime);
        lastSavedTime = parseInt(savedLastSavedTime);
        updateDisplay();

        // Calculate time elapsed since the last save and update moneyEarned
        if (savedIsRunning === 'true') {
            if (lastSavedTime > 0) {
                const currentTime = Date.now();
                const elapsedTimeSinceLastSave = Math.floor((currentTime - lastSavedTime) / 1000); // Time in seconds
                secondsElapsed += elapsedTimeSinceLastSave;
                calculateEarnings();
            }

            if (savedElapsedTime > 0) {
                startStopwatch();
            }
        } else {
            // make the start/stop button display 'play_arrow' if the stopwatch is not running
            startStopIcon.textContent = 'play_arrow';
        }
    }
}

// Function to update the display
function updateDisplay() {
    earnedDisplay.textContent = `$${moneyEarned.toFixed(2)}`;
    timeElapsedDisplay.textContent = formatTime(secondsElapsed);
    document.title = `$${moneyEarned.toFixed(2)}`;
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
    if (isRunning) return;
    isRunning = true;
    intervalId = setInterval(() => {
        secondsElapsed++;
        timeElapsedDisplay.textContent = formatTime(secondsElapsed);
        calculateEarnings();
    }, 1000);
    startStopIcon.textContent = 'pause';
}

// Stop the stopwatch
function stopStopwatch() {
    isRunning = false;
    clearInterval(intervalId);
    startStopIcon.textContent = 'play_arrow';
}

// Calculate earnings
function calculateEarnings() {
    let timeSinceLastUpdate = secondsElapsed - incomeStartTime;
    let hourlyRate = incomeType === 'hourly' ? income : income / 2080;
    moneyEarned += (hourlyRate * (timeSinceLastUpdate / 3600));
    incomeStartTime = secondsElapsed;
    updateDisplay();
}

// Toggle start/stop button
startStopIcon.addEventListener('click', () => {
    if (isRunning) {
        stopStopwatch();
    } else {
        startStopwatch();
    }
});

// Handle Start button in modal
startBtn.addEventListener('click', () => {
    income = parseFloat(incomeInput.value);
    incomeType = incomeTypeInput.value;
    if (isNaN(income)) {
        alert('Please enter a valid income.');
    } else {
        incomeModal.style.display = 'none';
        incomeStartTime = 0;
        startStopwatch();
    }
});

// Load state on page load
window.onload = function() {
    loadState();
    if (income === 0) {
        incomeModal.style.display = 'block';
    }
};

// Save state on tab close
window.onbeforeunload = function() {
    saveState();
};

// Open settings modal when settings icon is clicked
settingsIcon.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

// Save settings and close modal when save button is clicked
saveBtn.addEventListener('click', () => {
    income = parseFloat(incomeEdit.value);
    incomeType = incomeTypeEdit.value;
    if (isNaN(income)) {
        alert('Please enter a valid income.');
    } else {
        settingsModal.style.display = 'none';
        incomeStartTime = secondsElapsed; // Update income start time
        saveState(); // Save the updated settings to localStorage
    }
});

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
};

// Event listener for the reset button in the settings modal
resetBtn.addEventListener('click', () => {
    // Reset all relevant values to their initial state
    moneyEarned = 0;
    secondsElapsed = 0;
    incomeStartTime = 0;
    isRunning = false; // Stop the stopwatch

    // Clear the stopwatch interval
    clearInterval(intervalId);
    intervalId = null;

    // Update the display and save the reset state
    updateDisplay();
    saveState();

    // Update the start/stop button icon to 'play_arrow' since the stopwatch is stopped
    startStopIcon.textContent = 'play_arrow';

    // Hide the settings modal after resetting
    settingsModal.style.display = 'none';
});

