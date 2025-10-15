// Lógica de UI para reloj ambiental
const api = '/api/envclock/';

function renderEnvClock() {
  fetch(api)
    .then(r => r.json())
    .then(data => {
      const div = document.getElementById('envclock-info');
      div.innerHTML = `
        <p>Es de <b>${data.is_day ? 'día' : 'noche'}</b>.</p>
        <p>Clima: <b>${data.weather}</b></p>
      `;
    });
}

renderEnvClock();
setInterval(renderEnvClock, 30000);
