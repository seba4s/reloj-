// Lógica de UI para temporizador
const api = '/api/timer/';
let interval = null;

function formatTime(s) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

function updateDisplay() {
  fetch(api)
    .then(r => r.json())
    .then(data => {
      document.getElementById('timer-display').textContent = formatTime(data.remaining);
      if (!data.running && interval) {
        clearInterval(interval); interval = null;
      }
    });
}

document.getElementById('timer-form').onsubmit = e => {
  e.preventDefault();
  const min = parseInt(e.target.minutes.value, 10) || 0;
  fetch(api + 'start', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({duration: min * 60})
  }).then(() => {
    if (!interval) interval = setInterval(updateDisplay, 500);
  });
};
document.getElementById('timer-stop').onclick = () => {
  fetch(api + 'stop', {method: 'POST'}).then(() => {
    clearInterval(interval); interval = null; updateDisplay();
  });
};
document.getElementById('timer-reset').onclick = () => {
  fetch(api + 'reset', {method: 'POST'}).then(() => {
    clearInterval(interval); interval = null; updateDisplay();
  });
};

updateDisplay();
