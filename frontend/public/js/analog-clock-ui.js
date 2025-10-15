/**
 * Reloj Analógico - Manejo de manecillas y animación
 */

let analogClockInterval = null;

/**
 * Actualiza la posición de las manecillas del reloj analógico
 */
function updateAnalogClock() {
  const now = new Date();
  
  // Obtener tiempo
  const hours = now.getHours() % 12; // Convertir a formato 12 horas
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  
  // Calcular ángulos (0 grados = 12 en punto, sentido horario)
  // Segundos: 360° / 60 segundos = 6° por segundo
  const secondsDegrees = (seconds + milliseconds / 1000) * 6;
  
  // Minutos: 360° / 60 minutos = 6° por minuto + fracción de segundos
  const minutesDegrees = (minutes * 6) + (seconds / 10);
  
  // Horas: 360° / 12 horas = 30° por hora + fracción de minutos
  const hoursDegrees = (hours * 30) + (minutes / 2);
  
  // Aplicar rotación a las manecillas
  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  const secondHand = document.getElementById('second-hand');
  
  if (hourHand) {
    hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
  }
  
  if (minuteHand) {
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  }
  
  if (secondHand) {
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  }
  
  // Actualizar fecha
  updateAnalogClockDate(now);
}

/**
 * Actualiza la fecha mostrada debajo del reloj analógico
 */
function updateAnalogClockDate(date = new Date()) {
  const dateText = document.getElementById('analog-date-text');
  if (!dateText) return;
  
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const formattedDate = date.toLocaleDateString('es-ES', options);
  dateText.textContent = formattedDate;
}

/**
 * Inicia el reloj analógico
 */
function startAnalogClock() {
  // Detener cualquier intervalo previo
  stopAnalogClock();
  
  // Actualizar inmediatamente
  updateAnalogClock();
  
  // Actualizar cada 50ms para movimiento suave del segundero
  analogClockInterval = setInterval(updateAnalogClock, 50);
  
  console.log('⏰ Reloj analógico iniciado');
}

/**
 * Detiene el reloj analógico
 */
function stopAnalogClock() {
  if (analogClockInterval) {
    clearInterval(analogClockInterval);
    analogClockInterval = null;
    console.log('⏰ Reloj analógico detenido');
  }
}

/**
 * Alterna entre reloj digital y analógico
 */
function toggleClockMode() {
  const clockTitle = document.getElementById('clock-title');
  const analogContainer = document.querySelector('.analog-clock-container');
  const toggleButton = document.getElementById('clock-mode-toggle');
  
  if (!clockTitle) return;
  
  // Verificar modo actual
  const isDigitalVisible = clockTitle.style.display !== 'none';
  
  if (isDigitalVisible) {
    // Cambiar a analógico
    clockTitle.style.display = 'none';
    
    // Si no existe el contenedor analógico, cargarlo
    if (!analogContainer) {
      loadAnalogClock();
    } else {
      analogContainer.style.display = 'flex';
      startAnalogClock();
    }
    
    // Actualizar botón
    if (toggleButton) {
      toggleButton.innerHTML = '🕐';
      toggleButton.title = 'Cambiar a reloj digital';
    }
    
    // Guardar preferencia
    localStorage.setItem('clockMode', 'analog');
    console.log('🕐 Modo reloj: Analógico');
  } else {
    // Cambiar a digital
    clockTitle.style.display = 'block';
    
    if (analogContainer) {
      analogContainer.style.display = 'none';
      stopAnalogClock();
    }
    
    // Actualizar botón
    if (toggleButton) {
      toggleButton.innerHTML = '🕐';
      toggleButton.title = 'Cambiar a reloj analógico';
    }
    
    // Guardar preferencia
    localStorage.setItem('clockMode', 'digital');
    console.log('🕐 Modo reloj: Digital');
  }
}

/**
 * Carga el componente del reloj analógico
 */
async function loadAnalogClock() {
  try {
    const response = await fetch('/components/analog-clock.html');
    const html = await response.text();
    
    const clockContainer = document.getElementById('clock-center-container');
    if (!clockContainer) return;
    
    // Insertar el HTML del reloj analógico
    clockContainer.insertAdjacentHTML('beforeend', html);
    
    // Iniciar el reloj
    startAnalogClock();
    
    console.log('✅ Reloj analógico cargado');
  } catch (error) {
    console.error('❌ Error al cargar reloj analógico:', error);
  }
}

/**
 * Restaura la preferencia de modo de reloj guardada
 */
function restoreClockMode() {
  const savedMode = localStorage.getItem('clockMode');
  
  if (savedMode === 'analog') {
    // Cargar reloj analógico si está guardado como preferencia
    setTimeout(() => {
      toggleClockMode();
    }, 100);
  }
}

/**
 * Agrega marcadores de minutos al reloj (opcional, más detalle)
 */
function addMinuteMarkers() {
  const markerContainer = document.querySelector('.clock-minute-markers');
  if (!markerContainer) return;
  
  for (let i = 0; i < 60; i++) {
    // Saltar los marcadores de horas principales (cada 5 minutos)
    if (i % 5 === 0) continue;
    
    const marker = document.createElement('div');
    marker.className = 'minute-marker';
    marker.style.transform = `rotate(${i * 6}deg)`;
    
    const tick = document.createElement('div');
    tick.className = 'minute-tick';
    marker.appendChild(tick);
    
    markerContainer.appendChild(marker);
  }
}

/**
 * Inicialización cuando el DOM esté listo
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    restoreClockMode();
  });
} else {
  restoreClockMode();
}

// Exportar funciones para uso global
window.toggleClockMode = toggleClockMode;
window.startAnalogClock = startAnalogClock;
window.stopAnalogClock = stopAnalogClock;
