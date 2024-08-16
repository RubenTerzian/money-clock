console.log("script running...");

let hourlyWage = parseFloat(prompt("Enter your hourly wage:")) || 0;
let earnings = 0;
let elapsedTime = 0;
let running = false;
let intervalId;

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return '${hrs}:${mins}:${secs}';
}

function updateEarnings() {
    earnings = (elapsedTime / 3600) * hourlyWage;
    document.getElementById("earnings").innerText = 'You have earned: $${earnings.toFixed(2)}';
    document.title = '$${earnings.toFixed(2)}';
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

function editWage() {
    console.log("edit wage clicked...");
    const newWage = parseFloat(prompt("Enter your hourly wage:")) || 0;
    hourlyWage = newWage;
    elapsedTime = 0;
    earnings = 0;
    updateEarnings();
    updateTimer();
}

document.getElementById("playPaseButton").addEventListener("click", toggleTimer);
document.getElementById("editIncomeButton").addEventListener("click", editWage);

updateEarnings();
updateTimer();
