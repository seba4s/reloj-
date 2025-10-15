// Lógica de UI para cronómetro
const api = '/api/stopwatch/';
let interval = null;

function formatTime(s) {
  const ms = Math.floor((s % 1) * 10);
  const sec = Math.floor(s) % 60;
  const min = Math.floor(s / 60) % 60;
  const hr = Math.floor(s / 3600);
  return `${hr.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}.${ms}`;
}

function updateDisplay() {
  fetch(api)
    .then(r => r.json())
    .then(data => {
      document.getElementById('stopwatch-display').textContent = formatTime(data.elapsed);
    });
}

document.getElementById('stopwatch-start').onclick = () => {
  fetch(api + 'start', {method: 'POST'}).then(() => {
    if (!interval) interval = setInterval(updateDisplay, 100);
  });
};
document.getElementById('stopwatch-stop').onclick = () => {
  fetch(api + 'stop', {method: 'POST'}).then(() => {
    clearInterval(interval); interval = null; updateDisplay();
  });
};
document.getElementById('stopwatch-reset').onclick = () => {
  fetch(api + 'reset', {method: 'POST'}).then(() => {
    clearInterval(interval); interval = null; updateDisplay();
  });
};

updateDisplay();
