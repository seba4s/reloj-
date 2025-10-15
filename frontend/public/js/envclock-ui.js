// Lógica de UI para reloj ambiental
const envclockApi = '/api/envclock/';
let currentLocation = 'Madrid';

function renderEnvClock(city = currentLocation) {
  const div = document.getElementById('envclock-info');
  
  if (!div) {
    setTimeout(() => renderEnvClock(city), 500);
    return;
  }
  
  div.innerHTML = '<div class="loading">🔄 Cargando datos ambientales...</div>';
  
  const fetchUrl = envclockApi + city;
  
  fetch(fetchUrl)
    .then(r => {
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      }
      return r.json();
    })
    .then(data => {
      // Determinar el tema visual basado en el clima y hora
      const theme = getTheme(data);
      
      div.className = `env-display ${theme.class}`;
      div.innerHTML = `
        <div class="env-header">
          <h3>📍 ${data.city}</h3>
          <div class="current-time">
            <div class="time-large">${data.time}</div>
            <div class="date-small">${data.date}</div>
            <div class="timezone-small">${data.timezone}</div>
          </div>
        </div>
        
        <div class="weather-section">
          <div class="weather-main">
            <div class="weather-icon">${data.weather_emoji}</div>
            <div class="weather-info">
              <div class="weather-type">${data.weather}</div>
              <div class="temperature">${data.temperature}</div>
            </div>
          </div>
          
          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-label">Descripción:</span>
              <span class="detail-value">${data.description}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Humedad:</span>
              <span class="detail-value">${data.humidity}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Viento:</span>
              <span class="detail-value">${data.wind_speed}</span>
            </div>
          </div>
        </div>
        
        <div class="day-night-indicator">
          <div class="indicator ${data.is_day ? 'day' : 'night'}">
            ${data.is_day ? '☀️ Día' : '🌙 Noche'}
          </div>
        </div>
        
        <div class="data-status">
          ${data.time_success ? '🕐 ✅' : '🕐 ⚠️'} Hora: ${data.time_success ? 'Tiempo real' : 'Simulada'}
          <br>
          ${data.weather_success ? '🌤️ ✅' : '🌤️ ⚠️'} Clima: ${data.weather_success ? 'Datos reales' : 'Simulado'}
          ${!data.time_success || !data.weather_success ? '<br><small>🌐 Reintentando conexión en próxima actualización</small>' : ''}
        </div>
      `;
    })
    .catch(err => {
      div.className = 'env-display error';
      div.innerHTML = `
        <div class="error">
          <h3>❌ Error de Conexión</h3>
          <p><strong>No se pudieron cargar los datos ambientales de ${city}</strong></p>
          <p>Detalles: ${err.message}</p>
          <p>Posibles causas:</p>
          <ul>
            <li>🌐 Sin conexión a internet</li>
            <li>🔒 APIs bloqueadas por firewall</li>
            <li>⚡ Servidor temporalmente no disponible</li>
          </ul>
          <button onclick="renderEnvClock('${city}')" class="retry-btn">🔄 Reintentar</button>
          <button onclick="useFallbackData('${city}')" class="fallback-btn">📱 Usar datos simulados</button>
        </div>
      `;
    });
}

function getTheme(data) {
  const weather = data.weather.toLowerCase();
  const isDay = data.is_day;
  
  if (weather.includes('soleado')) {
    return { class: isDay ? 'sunny-day' : 'clear-night' };
  } else if (weather.includes('nublado')) {
    return { class: isDay ? 'cloudy-day' : 'cloudy-night' };
  } else if (weather.includes('lluvioso')) {
    return { class: isDay ? 'rainy-day' : 'rainy-night' };
  } else if (weather.includes('tormenta')) {
    return { class: 'stormy' };
  } else if (weather.includes('nieve')) {
    return { class: 'snowy' };
  } else {
    return { class: isDay ? 'default-day' : 'default-night' };
  }
}

function updateLocation() {
  const select = document.getElementById('location-select');
  currentLocation = select.value;
  renderEnvClock(currentLocation);
}

function useFallbackData(city) {
  const div = document.getElementById('envclock-info');
  
  // Datos simulados directamente en el frontend
  const now = new Date();
  const hour = now.getHours();
  const isDay = hour >= 6 && hour < 18;
  
  const fallbackData = {
    city: city,
    time: now.toLocaleTimeString('es-ES', { hour12: false }),
    date: now.toLocaleDateString('es-ES'),
    timezone: 'Local',
    is_day: isDay,
    weather: isDay ? 'soleado' : 'despejado',
    weather_emoji: isDay ? '☀️' : '🌙',
    temperature: `${Math.floor(Math.random() * 15) + 15}°C`,
    humidity: `${Math.floor(Math.random() * 40) + 40}%`,
    wind_speed: `${Math.floor(Math.random() * 20) + 5} km/h`,
    description: 'Datos simulados localmente',
    time_success: false,
    weather_success: false
  };
  
  const theme = getTheme(fallbackData);
  div.className = `env-display ${theme.class}`;
  
  div.innerHTML = `
    <div class="env-header">
      <h3>📍 ${fallbackData.city} (Modo Offline)</h3>
      <div class="current-time">
        <div class="time-large">${fallbackData.time}</div>
        <div class="date-small">${fallbackData.date}</div>
        <div class="timezone-small">${fallbackData.timezone}</div>
      </div>
    </div>
    
    <div class="weather-section">
      <div class="weather-main">
        <div class="weather-icon">${fallbackData.weather_emoji}</div>
        <div class="weather-info">
          <div class="weather-type">${fallbackData.weather}</div>
          <div class="temperature">${fallbackData.temperature}</div>
        </div>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">Descripción:</span>
          <span class="detail-value">${fallbackData.description}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humedad:</span>
          <span class="detail-value">${fallbackData.humidity}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Viento:</span>
          <span class="detail-value">${fallbackData.wind_speed}</span>
        </div>
      </div>
    </div>
    
    <div class="day-night-indicator">
      <div class="indicator ${fallbackData.is_day ? 'day' : 'night'}">
        ${fallbackData.is_day ? '☀️ Día' : '🌙 Noche'}
      </div>
    </div>
    
    <div class="data-status">
      📱 Modo Offline - Datos simulados localmente
      <br>
      <button onclick="renderEnvClock('${city}')" class="retry-btn">🌐 Intentar conexión</button>
    </div>
  `;
}

// Hacer funciones disponibles globalmente
window.useFallbackData = useFallbackData;

// Inicialización
function initEnvClock() {
  const envInfo = document.getElementById('envclock-info');
  const locationSelect = document.getElementById('location-select');
  
  if (!envInfo || !locationSelect) {
    setTimeout(initEnvClock, 200);
    return;
  }
  
  // Configurar el selector de ubicación
  locationSelect.onchange = function() {
    currentLocation = this.value;
    renderEnvClock(currentLocation);
  };
  
  // Configurar botón de actualización si existe
  const updateBtn = document.getElementById('update-location-btn');
  if (updateBtn) {
    updateBtn.onclick = function() {
      renderEnvClock(currentLocation);
    };
  }
  
  // Renderizar por primera vez
  renderEnvClock();
  
  // Actualizar cada 30 segundos
  setInterval(() => {
    renderEnvClock(currentLocation);
  }, 30000);
}

// Hacer la función disponible globalmente
window.initEnvClock = initEnvClock;

// Escuchar evento personalizado del main.js
document.addEventListener('envClockReady', function(event) {
  initEnvClock();
});

// Verificar si ya estamos en la página del reloj ambiental
function checkIfEnvClockPage() {
  const component = document.getElementById('envclock-component');
  if (component) {
    initEnvClock();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkIfEnvClockPage, 100);
  });
} else {
  setTimeout(checkIfEnvClockPage, 100);
}

// También escuchar cambios en el hash para SPAs
window.addEventListener('hashchange', () => {
  setTimeout(checkIfEnvClockPage, 200);
});

// Escuchar clicks en navegación
document.addEventListener('click', (e) => {
  if (e.target.matches('nav button[onclick*="envclock"]')) {
    setTimeout(checkIfEnvClockPage, 300);
  }
});

// Auto-inicializar si los elementos ya existen (para hot-reload)
setTimeout(() => {
  const envInfo = document.getElementById('envclock-info');
  if (envInfo && !envInfo.hasAttribute('data-initialized')) {
    console.log('🔄 Auto-inicializando reloj ambiental...');
    envInfo.setAttribute('data-initialized', 'true');
    initEnvClock();
  }
}, 500);
