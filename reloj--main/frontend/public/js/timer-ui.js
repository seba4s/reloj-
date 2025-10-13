// Lógica de UI para temporizador
const timerApi = '/api/timer/';
let interval = null;
let lastRemaining = null;

// Función para mostrar notificaciones
function showNotification(title, message) {
  // Mostrar notificación en la página
  showPageNotification(title, message, 'warning');
  
  // También mostrar notificación del sistema si está permitido
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/assets/timer-icon.png'
    });
  }
}

function formatTime(s) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

function updateDisplay() {
  fetch(timerApi)
    .then(r => r.json())
    .then(data => {
      document.getElementById('timer-display').textContent = formatTime(data.remaining);
      
      // Verificar si el temporizador llegó a cero
      if (lastRemaining !== null && lastRemaining > 0 && data.remaining <= 0) {
        showNotification('¡Temporizador finalizado!', 'El tiempo se ha acabado');
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
  
  // Pedir permiso para notificaciones al iniciar un temporizador
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
  
  fetch(timerApi + 'start', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({duration: min * 60})
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
