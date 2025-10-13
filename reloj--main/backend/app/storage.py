# Almacenamiento simple en memoria para alarmas
alarms = []

# Estructura: {'id': int, 'time': 'HH:MM', 'label': str, 'active': bool}

def get_alarms():
    return alarms

def add_alarm(alarm):
    alarms.append(alarm)

def update_alarm(alarm_id, data):
    for alarm in alarms:
        if alarm['id'] == alarm_id:
            alarm.update(data)
            return alarm
    return None

def delete_alarm(alarm_id):
    global alarms
    alarms = [a for a in alarms if a['id'] != alarm_id]
