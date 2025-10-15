// Lógica de UI para reloj mundial mejorado
const worldclockApi = '/api/worldclock/';
let selectedCities = ['Madrid', 'New York', 'Tokyo']; // Ciudades por defecto
let allCities = [];

function loadAvailableCities() {
  console.log('🌍 Cargando ciudades disponibles...');
  fetch(worldclockApi + 'cities')
    .then(r => {
      console.log('📡 Respuesta de ciudades:', r.status);
      return r.json();
    })
    .then(data => {
      console.log('✅ Ciudades cargadas:', data.cities);
      allCities = data.cities;
      const select = document.getElementById('city-select');
      
      if (!select) {
        console.error('❌ Elemento city-select no encontrado');
        return;
      }
      
      select.innerHTML = '<option value="">Selecciona una ciudad</option>';
      
      allCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
      });
    })
    .catch(err => {
      console.error('❌ Error loading cities:', err);
      // Fallback con ciudades por defecto
      allCities = ['Madrid', 'New York', 'Tokyo', 'London', 'Paris'];
      const select = document.getElementById('city-select');
      if (select) {
        select.innerHTML = '<option value="">Error cargando ciudades</option>';
        allCities.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          select.appendChild(option);
        });
      }
    });
}

function renderSelectedCities() {
  const container = document.getElementById('worldclock-list');
  if (!container) {
    console.error('❌ Elemento worldclock-list no encontrado');
    return;
  }
  
  console.log('🌍 Renderizando ciudades seleccionadas:', selectedCities);
  container.innerHTML = '';
  
  selectedCities.forEach(city => {
  fetch(worldclockApi + city)
      .then(r => {
        console.log(`📡 Respuesta para ${city}:`, r.status);
        return r.json();
      })
      .then(data => {
        console.log(`✅ Datos para ${city}:`, data);
        const cityDiv = document.createElement('div');
        cityDiv.className = 'city-clock';
        cityDiv.innerHTML = `
          <div class="city-info">
            <h4>${data.city}</h4>
            <div class="time-display">${data.time}</div>
            <div class="date-display">${data.date}</div>
            <div class="timezone-info">${data.timezone} (${data.utc_offset})</div>
            <button onclick="removeCity('${city}')" class="remove-btn">Eliminar</button>
          </div>
        `;
        container.appendChild(cityDiv);
      })
      .catch(err => {
        console.error(`❌ Error loading time for ${city}:`, err);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'city-error';
        errorDiv.innerHTML = `
          <div class="error-info">
            <h4>❌ ${city}</h4>
            <p>Error: ${err.message}</p>
            <button onclick="renderSelectedCities()" class="retry-btn">🔄 Reintentar</button>
          </div>
        `;
        container.appendChild(errorDiv);
      });
  });
}

function renderAllCities() {
  fetch(worldclockApi)
    .then(r => r.json())
    .then(times => {
      const container = document.getElementById('all-cities-list');
      container.innerHTML = '';
      
      Object.entries(times).forEach(([city, data]) => {
        const cityDiv = document.createElement('div');
        cityDiv.className = 'city-summary';
        cityDiv.innerHTML = `
          <div class="city-summary-info">
            <strong>${city}</strong>: ${data.time} 
            <span class="timezone-small">(${data.timezone})</span>
            ${!selectedCities.includes(city) ? 
              `<button onclick="addCityToSelected('${city}')" class="add-btn-small">+</button>` : 
              '<span class="selected-indicator">✓</span>'
            }
          </div>
        `;
        container.appendChild(cityDiv);
      });
    })
    .catch(err => console.error('Error loading all cities:', err));
}

function addCity() {
  const select = document.getElementById('city-select');
  const city = select.value;
  
  if (city && !selectedCities.includes(city)) {
    selectedCities.push(city);
    renderSelectedCities();
    renderAllCities(); // Actualizar para mostrar el indicador de seleccionado
    select.value = ''; // Limpiar selección
  }
}

function addCityToSelected(city) {
  if (!selectedCities.includes(city)) {
    selectedCities.push(city);
    renderSelectedCities();
    renderAllCities();
  }
}

function removeCity(city) {
  selectedCities = selectedCities.filter(c => c !== city);
  renderSelectedCities();
  renderAllCities();
}

// Hacer funciones disponibles globalmente
window.addCityToSelected = addCityToSelected;
window.removeCity = removeCity;

// Inicialización
function initWorldClock() {
  const addBtn = document.getElementById('add-city-btn');
  const worldclockList = document.getElementById('worldclock-list');
  const citySelect = document.getElementById('city-select');
  
  if (!addBtn || !worldclockList || !citySelect) {
    console.log('⏳ Elementos del reloj mundial no encontrados, reintentando...', {
      addBtn: !!addBtn,
      worldclockList: !!worldclockList,
      citySelect: !!citySelect
    });
    setTimeout(initWorldClock, 200);
    return;
  }
  
  console.log('✅ Iniciando reloj mundial...');
  
  // Event listeners
  addBtn.onclick = addCity;
  
  // Cargar datos
  loadAvailableCities();
  renderSelectedCities();
  renderAllCities();
  
  // Actualizar cada 10 segundos
  setInterval(() => {
    renderSelectedCities();
  }, 10000);
}

// Hacer la función disponible globalmente
window.initWorldClock = initWorldClock;

// Escuchar evento personalizado del main.js
document.addEventListener('worldClockReady', function(event) {
  console.log('📻 Evento worldClockReady recibido:', event.detail);
  initWorldClock();
});

// Verificar si ya estamos en la página del reloj mundial
function checkIfWorldClockPage() {
  const component = document.getElementById('worldclock-component');
  if (component) {
    console.log('🌍 Página del reloj mundial detectada');
    initWorldClock();
  } else {
    console.log('📄 No estamos en la página del reloj mundial');
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkIfWorldClockPage, 100);
  });
} else {
  setTimeout(checkIfWorldClockPage, 100);
}

// También escuchar cambios en el hash para SPAs
window.addEventListener('hashchange', () => {
  setTimeout(checkIfWorldClockPage, 200);
});

// Escuchar clicks en navegación
document.addEventListener('click', (e) => {
  if (e.target.matches('nav button[onclick*="worldclock"]')) {
    setTimeout(checkIfWorldClockPage, 300);
  }
});

// Auto-inicializar si los elementos ya existen (para hot-reload)
setTimeout(() => {
  const worldList = document.getElementById('worldclock-list');
  if (worldList && !worldList.hasAttribute('data-initialized')) {
    console.log('🔄 Auto-inicializando reloj mundial...');
    worldList.setAttribute('data-initialized', 'true');
    initWorldClock();
  }
}, 500);
