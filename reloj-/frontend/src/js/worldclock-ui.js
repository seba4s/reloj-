// Lógica de UI para reloj mundial
const api = '/api/worldclock/';

function renderWorldClock() {
  fetch(api)
    .then(r => r.json())
    .then(times => {
      const ul = document.getElementById('worldclock-list');
      ul.innerHTML = '';
      Object.entries(times).forEach(([city, time]) => {
        const li = document.createElement('li');
        li.textContent = `${city}: ${time}`;
        ul.appendChild(li);
      });
    });
}

renderWorldClock();
setInterval(renderWorldClock, 10000);
