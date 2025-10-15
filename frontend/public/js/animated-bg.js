// Animación y cambio de fondo SVG según día/noche
(function(){
  function animateSunMoon() {
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18;
    const svg = document.getElementById('mountain-bg');
    const themeBtn = document.getElementById('theme-toggle');
    
    if (!svg) return;
    
    // Cielo
    const sky = svg.getElementById('sky');
    sky.setAttribute('fill', isDay ? 'url(#skyDay)' : 'url(#skyNight)');
    
    // Montañas - aplicar gradientes a todas las capas
    const mountainsBack = svg.getElementById('mountains-back');
    const mountains = svg.getElementById('mountains');
    const mountains2 = svg.getElementById('mountains2');
    const mountains3 = svg.getElementById('mountains3');
    
    if (mountainsBack) mountainsBack.setAttribute('fill', isDay ? 'url(#mountainDay)' : 'url(#mountainNight)');
    if (mountains) mountains.setAttribute('fill', isDay ? 'url(#mountainDay)' : 'url(#mountainNight)');
    if (mountains2) mountains2.setAttribute('fill', isDay ? 'url(#mountainDay)' : 'url(#mountainNight)');
    if (mountains3) mountains3.setAttribute('fill', isDay ? 'url(#mountainDay)' : 'url(#mountainNight)');
    
    // Sol/luna
    const sunMoon = svg.getElementById('sun-moon');
    sunMoon.setAttribute('fill', isDay ? '#ff6a00' : '#fffbe6');
    
    // Animar posición (arco de 180°)
    // Calcular ángulo basado en si es día o noche
    let angle;
    if (isDay) {
      // Para el día: normalizar entre 6am (0) y 6pm (1)
      const dayProgress = (hour - 6 + now.getMinutes()/60) / 12;
      angle = Math.PI * dayProgress; // 0 a PI (semicírculo)
    } else {
      // Para la noche: normalizar entre 6pm (0) y 6am (1)
      const nightHour = hour >= 18 ? hour - 18 : hour + 6;
      const nightProgress = (nightHour + now.getMinutes()/60) / 12;
      angle = Math.PI * nightProgress; // 0 a PI (semicírculo)
    }
    
    const cx = 1200 + 400 * Math.cos(angle);
    const cy = 400 - 250 * Math.sin(angle);
    sunMoon.setAttribute('cx', cx);
    sunMoon.setAttribute('cy', cy);
    
    // Ya no sincronizamos automáticamente el tema aquí
    // Dejamos que el usuario controle manualmente el tema con el botón
    // El sol/luna se moverán según la hora real, pero el tema es independiente
  }
  
  function tryAnim() {
    if (document.getElementById('mountain-bg')) {
      animateSunMoon();
      setInterval(animateSunMoon, 60000);
    } else {
      setTimeout(tryAnim, 300);
    }
  }
  tryAnim();
})();
