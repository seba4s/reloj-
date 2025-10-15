const components = {
  alarm: '/src/components/alarm.html',
  stopwatch: '/src/components/stopwatch.html',
  timer: '/src/components/timer.html',
  worldclock: '/src/components/worldclock.html',
  envclock: '/src/components/envclock.html'
};

function showComponent(name) {
  fetch(components[name])
    .then(r => r.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      if (name === 'alarm') import('/src/js/alarms-ui.js');
      if (name === 'stopwatch') import('/src/js/stopwatch-ui.js');
      if (name === 'timer') import('/src/js/timer-ui.js');
      if (name === 'worldclock') import('/src/js/worldclock-ui.js');
      if (name === 'envclock') import('/src/js/envclock-ui.js');
    });
}

// Mostrar por defecto el reloj local (alarmas)
document.addEventListener('DOMContentLoaded', () => showComponent('alarm'));
