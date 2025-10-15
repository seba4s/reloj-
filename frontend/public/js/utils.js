/**
 * Utilidades compartidas para el proyecto
 * Contiene funciones comunes usadas en múltiples archivos
 */

// ============ NOTIFICACIONES ============

/**
 * Muestra una notificación (página + sistema)
 * @param {string} title - Título de la notificación
 * @param {string} message - Mensaje de la notificación
 * @param {string} type - Tipo: 'success', 'warning', 'error', 'info'
 */
function showNotification(title, message, type = 'info') {
  // Notificación en la página
  showPageNotification(title, message, type);
  
  // Notificación del sistema
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: `/assets/${type}-icon.png`
    });
  }
}

/**
 * Solicita permisos para notificaciones del sistema
 */
function requestNotificationPermission() {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// ============ FORMATEO DE TIEMPO ============

/**
 * Formatea segundos a MM:SS
 * @param {number} seconds - Segundos a formatear
 * @returns {string} Tiempo formateado
 */
function formatTimeMMSS(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Formatea segundos a HH:MM:SS.ms
 * @param {number} seconds - Segundos a formatear (puede incluir decimales)
 * @returns {string} Tiempo formateado
 */
function formatTimeHHMMSSMS(seconds) {
  const ms = Math.floor((seconds % 1) * 10);
  const sec = Math.floor(seconds) % 60;
  const min = Math.floor(seconds / 60) % 60;
  const hr = Math.floor(seconds / 3600);
  return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms}`;
}

// ============ MANEJO DE FETCH ============

/**
 * Wrapper para fetch con manejo de errores
 * @param {string} url - URL de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise} Promesa con la respuesta JSON
 */
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en fetch a ${url}:`, error);
    throw error;
  }
}

// ============ INICIALIZACIÓN DE COMPONENTES ============

/**
 * Inicializa un componente cuando el DOM esté listo
 * @param {Function} initFunction - Función de inicialización
 * @param {number} delay - Retraso opcional en ms
 */
function initComponent(initFunction, delay = 0) {
  const init = () => {
    if (delay > 0) {
      setTimeout(initFunction, delay);
    } else {
      initFunction();
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

/**
 * Espera a que un elemento exista en el DOM
 * @param {string} selector - Selector CSS del elemento
 * @param {number} maxAttempts - Intentos máximos
 * @param {number} interval - Intervalo entre intentos (ms)
 * @returns {Promise<Element>} Promesa con el elemento
 */
function waitForElement(selector, maxAttempts = 20, interval = 200) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      const element = document.getElementById(selector) || document.querySelector(selector);
      
      if (element) {
        resolve(element);
      } else if (attempts >= maxAttempts) {
        reject(new Error(`Elemento ${selector} no encontrado después de ${maxAttempts} intentos`));
      } else {
        attempts++;
        setTimeout(check, interval);
      }
    };
    
    check();
  });
}

// Hacer las funciones disponibles globalmente
window.showNotification = showNotification;
window.requestNotificationPermission = requestNotificationPermission;
window.formatTimeMMSS = formatTimeMMSS;
window.formatTimeHHMMSSMS = formatTimeHHMMSSMS;
window.fetchAPI = fetchAPI;
window.initComponent = initComponent;
window.waitForElement = waitForElement;
