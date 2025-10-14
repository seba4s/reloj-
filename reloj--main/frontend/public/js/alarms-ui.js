// Lógica de UI para alarmas
const api = '/api/alarms/';

// Almacena las alarmas que ya han sonado
const triggeredAlarms = new Set();

// Variable para mantener la lista de alarmas actual
let currentAlarms = [];

// Función para verificar si una alarma debe sonar
function checkAlarm(alarm) {
  const now = new Date();
  const [hours, minutes] = alarm.time.split(':');
  const alarmTime = new Date();
  alarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Si la alarma ya sonó hoy, no la volvemos a disparar
  const alarmKey = `${alarm.id}-${now.toDateString()}`;
  if (triggeredAlarms.has(alarmKey)) {
    return;
  }
  
  // Verificar si es hora de la alarma (con un margen de 1 segundo)
  const nowWithoutMs = new Date(now);
  nowWithoutMs.setMilliseconds(0);
  
  const timeDiff = Math.abs(nowWithoutMs - alarmTime);
  if (timeDiff < 1000) {
    showNotification('¡Alarma!', 
      alarm.label ? 
      `¡Es hora de ${alarm.label}!` : 
      '¡Es hora de tu alarma!',
      'warning'
    );
    triggeredAlarms.add(alarmKey);
  }
}

function renderAlarms() {
  fetch(api)
    .then(r => r.json())
    .then(alarms => {
      currentAlarms = alarms; // Guardar las alarmas actuales
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
    });
}

// Iniciar el verificador de alarmas solo una vez
if (!window.alarmChecker) {
  window.alarmChecker = setInterval(() => {
    const now = new Date();
    // Limpiar alarmas disparadas de días anteriores
    for (const key of triggeredAlarms) {
      if (!key.includes(now.toDateString())) {
        triggeredAlarms.delete(key);
      }
    }
    // Verificar alarmas usando la lista actual
    currentAlarms.forEach(checkAlarm);
  }, 1000);
}

function initAlarms() {
  const form = document.getElementById('alarm-form');
  
  if (form) {
    // Solicitar permisos de notificación al cargar
    requestNotificationPermission();
    
    form.onsubmit = e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      
      // Asegurarnos de tener permisos de notificación
      requestNotificationPermission();
      
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
initComponent(initAlarms);
