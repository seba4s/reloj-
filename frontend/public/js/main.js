// Función para actualizar el reloj del título
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-ES', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const dateString = now.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  });
  
  const clockTitle = document.getElementById('clock-title');
  if (clockTitle) {
    clockTitle.innerHTML = `
    <div style="font-size: 16rem; font-family: 'Letter Magic', Georgia, 'Times New Roman', Times, serif; text-align: center; font-weight: bold; color: var(--primary, #3e5f8a); letter-spacing: 2px; line-height: 1.1; text-shadow: 0 2px 16px rgba(62,95,138,0.15), 0 1px 0 #fff;">${timeString}</div>
      <div style="font-size: 1.2rem; opacity: 0.85; font-weight: normal; text-align: center; margin-top: 0.2rem; color: var(--primary, #3e5f8a); text-shadow: 0 1px 8px rgba(62,95,138,0.10);">${dateString}</div>
    `;
  }
}


// Iniciar el reloj
function startClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

// Función para calcular la posición del sol/luna según la hora
function calculateSunMoonPosition() {
  const now = new Date();
  const hour = now.getHours();
  const isDay = hour >= 6 && hour < 18;
  
  let angle;
  if (isDay) {
    const dayProgress = (hour - 6 + now.getMinutes()/60) / 12;
    angle = Math.PI * dayProgress;
  } else {
    const nightHour = hour >= 18 ? hour - 18 : hour + 6;
    const nightProgress = (nightHour + now.getMinutes()/60) / 12;
    angle = Math.PI * nightProgress;
  }
  
  const cx = 1200 + 400 * Math.cos(angle);
  const cy = 400 - 250 * Math.sin(angle);
  
  return { cx, cy, isDay };
}

// Modo claro/oscuro
function setTheme(mode) {
  const body = document.body;
  const btn = document.getElementById('theme-toggle');
  const svg = document.getElementById('mountain-bg');

  if (svg) {
    const sky = svg.getElementById('sky');
    const mountainsBack = svg.getElementById('mountains-back');
    const mountains = svg.getElementById('mountains');
    const mountains2 = svg.getElementById('mountains2');
    const mountains3 = svg.getElementById('mountains3');
    const sunMoon = svg.getElementById('sun-moon');

    // Calcular posición correcta según la hora
    const { cx, cy, isDay } = calculateSunMoonPosition();

    if (mode === 'dark') {
      // Paso 1: Transición a atardecer (dusk)
      if (sky) sky.setAttribute('fill', 'url(#skyDusk)');
      if (mountainsBack) mountainsBack.setAttribute('fill', 'url(#mountainDusk)');
      if (mountains) mountains.setAttribute('fill', 'url(#mountainDusk)');
      if (mountains2) mountains2.setAttribute('fill', 'url(#mountainDusk)');
      if (mountains3) mountains3.setAttribute('fill', 'url(#mountainDusk)');
      
      // Animación: el sol baja en diagonal
      if (sunMoon) {
        const currentCx = parseFloat(sunMoon.getAttribute('cx'));
        const currentCy = parseFloat(sunMoon.getAttribute('cy'));
        
        sunMoon.style.transition = 'cx 1.5s ease-in-out, cy 1.5s ease-in-out, opacity 1.2s ease-in-out';
        sunMoon.setAttribute('cx', currentCx - 200);
        sunMoon.setAttribute('cy', 1200);
        sunMoon.style.opacity = '0';
        
        // Paso 2: Después del atardecer, transición a noche
        setTimeout(() => {
          if (sky) sky.setAttribute('fill', 'url(#skyNight)');
          if (mountainsBack) mountainsBack.setAttribute('fill', 'url(#mountainNight)');
          if (mountains) mountains.setAttribute('fill', 'url(#mountainNight)');
          if (mountains2) mountains2.setAttribute('fill', 'url(#mountainNight)');
          if (mountains3) mountains3.setAttribute('fill', 'url(#mountainNight)');
          
          // Cambiar a luna y hacerla subir
          sunMoon.setAttribute('fill', '#fffbe6');
          sunMoon.setAttribute('cx', cx + 200);
          sunMoon.setAttribute('cy', 1200);
          sunMoon.style.opacity = '0';
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              sunMoon.style.opacity = '1';
              sunMoon.setAttribute('cx', cx);
              sunMoon.setAttribute('cy', cy);
            });
          });
        }, 2000);
      }
      
      // Cambiar a modo nocturno
      setTimeout(() => {
        body.classList.add('dark-mode');
        if (btn) btn.textContent = '☀️';
      }, 1000);
      
    } else {
      // Paso 1: Transición a amanecer (dawn)
      if (sky) sky.setAttribute('fill', 'url(#skyDawn)');
      if (mountainsBack) mountainsBack.setAttribute('fill', 'url(#mountainDawn)');
      if (mountains) mountains.setAttribute('fill', 'url(#mountainDawn)');
      if (mountains2) mountains2.setAttribute('fill', 'url(#mountainDawn)');
      if (mountains3) mountains3.setAttribute('fill', 'url(#mountainDawn)');
      
      // Animación: la luna baja en diagonal
      if (sunMoon) {
        const currentCx = parseFloat(sunMoon.getAttribute('cx'));
        const currentCy = parseFloat(sunMoon.getAttribute('cy'));
        
        sunMoon.style.transition = 'cx 1.5s ease-in-out, cy 1.5s ease-in-out, opacity 1.2s ease-in-out';
        sunMoon.setAttribute('cx', currentCx - 200);
        sunMoon.setAttribute('cy', 1200);
        sunMoon.style.opacity = '0';
        
        // Paso 2: Después del amanecer, transición a día
        setTimeout(() => {
          if (sky) sky.setAttribute('fill', 'url(#skyDay)');
          if (mountainsBack) mountainsBack.setAttribute('fill', 'url(#mountainDay)');
          if (mountains) mountains.setAttribute('fill', 'url(#mountainDay)');
          if (mountains2) mountains2.setAttribute('fill', 'url(#mountainDay)');
          if (mountains3) mountains3.setAttribute('fill', 'url(#mountainDay)');
          
          // Cambiar a sol y hacerlo subir
          sunMoon.setAttribute('fill', '#ff6a00');
          sunMoon.setAttribute('cx', cx + 200);
          sunMoon.setAttribute('cy', 1200);
          sunMoon.style.opacity = '0';
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              sunMoon.style.opacity = '1';
              sunMoon.setAttribute('cx', cx);
              sunMoon.setAttribute('cy', cy);
            });
          });
        }, 2000);
      }
      
      // Cambiar a modo diurno
      setTimeout(() => {
        body.classList.remove('dark-mode');
        if (btn) btn.textContent = '🌙';
      }, 1000);
    }
  } else {
    // Fallback sin animación si no existe el SVG
    if (mode === 'dark') {
      body.classList.add('dark-mode');
      if (btn) btn.textContent = '☀️';
    } else {
      body.classList.remove('dark-mode');
      if (btn) btn.textContent = '🌙';
    }
  }
  
  localStorage.setItem('theme', mode);
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(isDark ? 'light' : 'dark');
}

window.addEventListener('DOMContentLoaded', async () => {
  // Preferencia guardada o sistema
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved ? saved : (prefersDark ? 'dark' : 'light'));
  // Cargar fondo animado SVG
  const bgContainer = document.getElementById('animated-bg-container');
  if (bgContainer) {
    const resp = await fetch('/components/animated-bg.html');
    const html = await resp.text();
    bgContainer.innerHTML = html;
  }
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);
  startClock();
});

const components = {
  alarm: '/components/alarm.html',
  stopwatch: '/components/stopwatch.html',
  timer: '/components/timer.html',
  worldclock: '/components/worldclock.html',
  envclock: '/components/envclock.html'
};

// Función para cargar un script dinámicamente
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Remover el script anterior si existe
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function showComponent(name) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '<div style="padding: 20px; text-align: center;">🔄 Cargando...</div>';
  
  fetch(components[name])
    .then(r => {
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      }
      return r.text();
    })
    .then(html => {
      mainContent.innerHTML = html;
      
      // Esperar a que el DOM se actualice
      requestAnimationFrame(() => {
        let scriptUrl = '';
        switch(name) {
          case 'alarm': scriptUrl = '/js/alarms-ui.js'; break;
          case 'stopwatch': scriptUrl = '/js/stopwatch-ui.js'; break;
          case 'timer': scriptUrl = '/js/timer-ui.js'; break;
          case 'worldclock': scriptUrl = '/js/worldclock-ui.js'; break;
          case 'envclock': scriptUrl = '/js/envclock-ui.js'; break;
        }
        
        if (scriptUrl) {
          // Remover script existente si lo hay
          const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
          if (existingScript) {
            existingScript.remove();
          }

          // Crear y añadir nuevo script
          const script = document.createElement('script');
          script.src = scriptUrl;
          script.onload = () => {
            // Inicializar componentes específicos
            if (name === 'alarm') {
              if (typeof renderAlarms === 'function') {
                renderAlarms();
              }
            } else if (name === 'stopwatch') {
              if (typeof updateDisplay === 'function') {
                updateDisplay();
              }
            } else if (name === 'envclock') {
              triggerEnvClockInit();
            } else if (name === 'worldclock') {
              triggerWorldClockInit();
            }
          };
          document.body.appendChild(script);
        }
      });
    })
    .catch(err => {
      mainContent.innerHTML = 
        `<div style="color: red; padding: 20px; text-align: center;">
          <h3>❌ Error cargando el componente ${name}</h3>
          <p>Detalles: ${err.message}</p>
          <button onclick="showComponent('${name}')" style="padding: 10px 20px; margin-top: 10px; background: #0f3460; color: white; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Reintentar
          </button>
        </div>`;
    });
}

// Funciones para inicializar componentes específicos
function triggerEnvClockInit() {
  setTimeout(() => {
    const envComponent = document.getElementById('envclock-component');
    const envInfo = document.getElementById('envclock-info');
    const locationSelect = document.getElementById('location-select');
    
    if (envComponent && envInfo && locationSelect) {
      // Trigger evento personalizado
      const event = new CustomEvent('envClockReady', {
        detail: { component: envComponent, info: envInfo, select: locationSelect }
      });
      document.dispatchEvent(event);
      
      // Llamar función directa si existe
      if (window.initEnvClock) {
        window.initEnvClock();
      }
    } else {
      setTimeout(triggerEnvClockInit, 200);
    }
  }, 200);
}

function triggerWorldClockInit() {
  setTimeout(() => {
    const worldComponent = document.getElementById('worldclock-component');
    const worldList = document.getElementById('worldclock-list');
    const citySelect = document.getElementById('city-select');
    
    if (worldComponent && worldList && citySelect) {
      // Trigger evento personalizado
      const event = new CustomEvent('worldClockReady', {
        detail: { component: worldComponent, list: worldList, select: citySelect }
      });
      document.dispatchEvent(event);
      
      // Llamar función directa si existe
      if (window.initWorldClock) {
        window.initWorldClock();
      }
    } else {
      setTimeout(triggerWorldClockInit, 200);
    }
  }, 200);
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  showComponent('alarm');
});

// Hacer la función disponible globalmente para onclick
window.showComponent = showComponent;
