// Lógica de UI para cronómetro
const stopwatchApi = '/api/stopwatch/';
let interval = null;

function formatTime(s) {
  const ms = Math.floor((s % 1) * 10);
  const sec = Math.floor(s) % 60;
  const min = Math.floor(s / 60) % 60;
  const hr = Math.floor(s / 3600);
  return `${hr.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}.${ms}`;
}

function updateDisplay() {
  fetch(stopwatchApi)
    .then(r => r.json())
    .then(data => {
      document.getElementById('stopwatch-display').textContent = formatTime(data.elapsed);
    });
}

function initStopwatch() {
  const startBtn = document.getElementById('stopwatch-start');
  const stopBtn = document.getElementById('stopwatch-stop');
  const resetBtn = document.getElementById('stopwatch-reset');

  if (startBtn && stopBtn && resetBtn) {
    startBtn.onclick = () => {
      fetch(stopwatchApi + 'start', {method: 'POST'})
        .then(response => {
          if (response.ok && !interval) {
            interval = setInterval(updateDisplay, 100);
          }
        })
        .catch(error => console.error('Error starting stopwatch:', error));
    };

    stopBtn.onclick = () => {
      fetch(stopwatchApi + 'stop', {method: 'POST'})
        .then(response => {
          if (response.ok) {
            clearInterval(interval);
            interval = null;
            updateDisplay();
          }
        })
        .catch(error => console.error('Error stopping stopwatch:', error));
    };

    resetBtn.onclick = () => {
      fetch(stopwatchApi + 'reset', {method: 'POST'})
        .then(response => {
          if (response.ok) {
            clearInterval(interval);
            interval = null;
            updateDisplay();
          }
        })
        .catch(error => console.error('Error resetting stopwatch:', error));
    };

    // Inicializar display
    updateDisplay();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStopwatch);
} else {
  initStopwatch();
}

updateDisplay();
