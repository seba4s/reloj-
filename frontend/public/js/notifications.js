// Sistema de notificaciones en página
function showPageNotification(title, message, type = 'success') {
    const container = document.getElementById('notifications-container');
    
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification-message ${type}`;
    
    // Contenido de la notificación
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const titleElem = document.createElement('div');
    titleElem.className = 'notification-title';
    titleElem.textContent = title;
    
    const bodyElem = document.createElement('div');
    bodyElem.className = 'notification-body';
    bodyElem.textContent = message;
    
    content.appendChild(titleElem);
    content.appendChild(bodyElem);
    
    // Botón de cerrar
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => removeNotification(notification);
    
    notification.appendChild(content);
    notification.appendChild(closeButton);
    
    // Agregar al contenedor
    container.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}