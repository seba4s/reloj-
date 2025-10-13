// Animación y cambio de fondo SVG según día/noche
(function(){
  function animateSunMoon() {
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18;
    const svg = document.getElementById('mountain-bg');
    if (!svg) return;
    // Cielo
    const sky = svg.getElementById('sky');
    sky.setAttribute('fill', isDay ? 'url(#skyDay)' : 'url(#skyNight)');
    // Montañas
    svg.getElementById('mountains').setAttribute('fill', isDay ? 'url(#mountainDay)' : 'url(#mountainNight)');
    svg.getElementById('mountains2').setAttribute('fill', isDay ? 'url(#mountainDay)' : 'url(#mountainNight)');
    // Sol/luna
    const sunMoon = svg.getElementById('sun-moon');
    sunMoon.setAttribute('fill', isDay ? '#ff6a00' : '#fffbe6');
    // Animar posición (arco de 180°)
    const t = ((hour % 24) + now.getMinutes()/60) / 24; // 0 a 1
    const angle = isDay ? (Math.PI * (t * 2 - 0.5)) : (Math.PI * (t * 2 + 0.5));
    const cx = 960 + 600 * Math.cos(angle);
    const cy = 700 - 350 * Math.sin(angle);
    sunMoon.setAttribute('cx', cx);
    sunMoon.setAttribute('cy', cy);
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
