"""
Almacenamiento usando Lista Circular Doblemente Enlazada para alarmas.
Esta estructura permite navegación bidireccional y circular entre alarmas.
"""

from .circular_list import CircularDoublyLinkedList

# Estructura de datos: Lista Circular Doblemente Enlazada
# Cada nodo contiene: {'id': int, 'time': 'HH:MM', 'label': str, 'active': bool}
alarms = CircularDoublyLinkedList()

def get_alarms():
    """
    Retorna todas las alarmas como una lista de Python.
    Convierte la lista circular a formato JSON-serializable.
    """
    return alarms.to_list()

def add_alarm(alarm):
    """
    Añade una nueva alarma al final de la lista circular.
    La alarma se inserta manteniendo las referencias circulares.
    """
    alarms.insert_at_end(alarm)
    return alarm

def update_alarm(alarm_id, data):
    """
    Actualiza una alarma existente por su ID.
    Retorna la alarma actualizada si se encuentra, None si no existe.
    """
    if alarms.update_by_id(alarm_id, data):
        return alarms.search_by_id(alarm_id)
    return None

def delete_alarm(alarm_id):
    """
    Elimina una alarma por su ID.
    Retorna True si se eliminó, False si no se encontró.
    """
    return alarms.delete_by_id(alarm_id)

def get_alarm_by_id(alarm_id):
    """
    Busca y retorna una alarma específica por su ID.
    """
    return alarms.search_by_id(alarm_id)

def next_alarm():
    """
    Navega a la siguiente alarma de forma circular.
    Retorna la alarma actual después de moverse.
    """
    return alarms.next_item()

def prev_alarm():
    """
    Navega a la alarma anterior de forma circular.
    Retorna la alarma actual después de moverse.
    """
    return alarms.prev_item()

def get_current_alarm():
    """
    Retorna la alarma actual sin mover el puntero de navegación.
    """
    return alarms.get_current()

def reset_alarm_navigation():
    """
    Reinicia el puntero de navegación a la primera alarma.
    """
    return alarms.reset_current()

def get_alarms_count():
    """
    Retorna el número total de alarmas en la lista.
    """
    return len(alarms)

def display_alarms_structure():
    """
    Retorna una representación visual de la estructura circular.
    Útil para debugging y demostrar la estructura.
    """
    return {
        'forward': alarms.display_forward(),
        'backward': alarms.display_backward(),
        'size': len(alarms),
        'is_empty': alarms.is_empty()
    }
