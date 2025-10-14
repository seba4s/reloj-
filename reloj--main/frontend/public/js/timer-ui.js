// Lógica de UI para temporizador
const timerApi = '/api/timer/';
let interval = null;
let lastRemaining = null;

function updateDisplay() {
  fetch(timerApi)
    .then(r => r.json())
    .then(data => {
      document.getElementById('timer-display').textContent = formatTimeMMSS(data.remaining);
      
      // Verificar si el temporizador llegó a cero
      if (lastRemaining !== null && lastRemaining > 0 && data.remaining <= 0) {
        showNotification('¡Temporizador finalizado!', 'El tiempo se ha acabado', 'warning');
      }
      
      lastRemaining = data.remaining;
      
      if (!data.running && interval) {
        clearInterval(interval); 
        interval = null;
      }
    });
}

document.getElementById('timer-form').onsubmit = e => {
  e.preventDefault();
  const min = parseInt(e.target.minutes.value, 10) || 0;
  const sec = parseInt(e.target.seconds.value, 10) || 0;
  
  // Verificar que al menos hay un segundo
  if (min === 0 && sec === 0) {
    return;
  }
  
  // Pedir permiso para notificaciones al iniciar un temporizador
  requestNotificationPermission();
  
  fetch(timerApi + 'start', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({duration: (min * 60) + sec})
  }).then(() => {
    if (!interval) interval = setInterval(updateDisplay, 500);
  });
};
document.getElementById('timer-stop').onclick = () => {
  fetch(timerApi + 'stop', {method: 'POST'}).then(() => {
    clearInterval(interval); interval = null; updateDisplay();
  });
};
document.getElementById('timer-reset').onclick = () => {
  fetch(timerApi + 'reset', {method: 'POST'}).then(() => {
    clearInterval(interval); interval = null; updateDisplay();
  });
};

updateDisplay();
