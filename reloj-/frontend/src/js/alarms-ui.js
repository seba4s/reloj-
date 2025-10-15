// Lógica de UI para alarmas
const api = '/api/alarms/';

function renderAlarms() {
  fetch(api)
    .then(r => r.json())
    .then(alarms => {
      const ul = document.getElementById('alarms-list');
      ul.innerHTML = '';
      alarms.forEach(alarm => {
        const li = document.createElement('li');
        li.textContent = `${alarm.time} - ${alarm.label}`;
        const del = document.createElement('button');
        del.textContent = 'Eliminar';
        del.onclick = () => {
          fetch(api + alarm.id, {method: 'DELETE'}).then(renderAlarms);
        };
        li.appendChild(del);
        ul.appendChild(li);
      });
    });
}

document.getElementById('alarm-form').onsubmit = e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  fetch(api, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(() => {
    e.target.reset();
    renderAlarms();
  });
};

renderAlarms();
