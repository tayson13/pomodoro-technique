const { exec } = require("child_process");

const workDuration = 8;
const breakDuration = 6;
const totalCycles = 4; // Number of cycles to complete

let completedCycles = 0;

const messages = {
  workStart: "Work complete! Take a break.",
  breakStart: "Break time over! Back to work.",
  allCyclesComplete: "All cycles completed! Timer stopped.",
};

function playAlertSound(alert) {
  exec(`aplay ${alert}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error playing alert sound: ${error}`);
    }
  });
}

function logMessage(message) {
  console.clear();
  console.log(message);

  playAlertSound(
    totalCycles > completedCycles ? "alarm.wav" : "vintage-warning-alarm.wav"
  );
}

function startTimer(duration, isWorking) {
  let timer = duration;
  const countdown = setInterval(() => {
    const minutes = parseInt(timer / 60, 10);
    const seconds = parseInt(timer % 60, 10);

    console.log(`${minutes}:${seconds}`);

    if (--timer < 0) {
      clearInterval(countdown);

      if (isWorking) {
        logMessage(messages.workStart);
        startTimer(breakDuration, false);
      } else {
        if (completedCycles < totalCycles) {
          logMessage(messages.breakStart);
          completedCycles++;
          startTimer(workDuration, true);
        } else {
          logMessage(messages.allCyclesComplete);
        }
      }
    }
  }, 1000);
}

console.log(
  `Cycle duration: ${workDuration / 60} minutes\nBreak duration: ${
    breakDuration / 60
  } minutes\nStarting program...`
);

startTimer(workDuration, true); // Start with a work period
