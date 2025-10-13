// Lógica de UI para alarmas
const api = '/api/alarms/';

// Función para mostrar notificaciones
function showNotification(title, message) {
  // Mostrar notificación en la página
  showPageNotification(title, message, 'warning');
  
  // También mostrar notificación del sistema si está permitido
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/assets/alarm-icon.png'
    });
  }
}

// Función para verificar si una alarma debe sonar
function checkAlarm(alarm) {
  const now = new Date();
  const [hours, minutes] = alarm.time.split(':');
  const alarmTime = new Date();
  alarmTime.setHours(parseInt(hours), parseInt(minutes), 0);
  
  // Si la hora actual coincide con la hora de la alarma (con un margen de 1 segundo)
  if (Math.abs(now - alarmTime) < 1000) {
    showNotification('¡Alarma!', alarm.label || '¡Es hora de tu alarma!');
  }
}

function renderAlarms() {
  fetch(api)
    .then(r => r.json())
    .then(alarms => {
      const ul = document.getElementById('alarms-list');
      ul.innerHTML = '';
      alarms.forEach(alarm => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <span style="font-size: 1.2rem; color: var(--header-text);">${alarm.time}</span>
            <span style="margin-left: 1rem; opacity: 0.8;">${alarm.label}</span>
          </div>
        `;
        const del = document.createElement('button');
        del.textContent = 'Eliminar';
        del.className = 'component-button';
        del.onclick = () => {
          fetch(api + alarm.id, {method: 'DELETE'}).then(renderAlarms);
        };
        li.appendChild(del);
        ul.appendChild(li);
      });

      // Verificar las alarmas cada segundo
      if (!window.alarmChecker) {
        window.alarmChecker = setInterval(() => {
          alarms.forEach(checkAlarm);
        }, 1000);
      }
    });
}

function initAlarms() {
  const form = document.getElementById('alarm-form');
  
  if (form) {
    form.onsubmit = e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      
      fetch(api, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          e.target.reset();
          renderAlarms();
        } else {
          throw new Error('Error adding alarm');
        }
      })
      .catch(error => console.error('Error in alarm submission:', error));
    };

    // Cargar alarmas existentes
    renderAlarms();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAlarms);
} else {
  initAlarms();
}
