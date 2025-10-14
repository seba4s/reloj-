"""
Implementación de Lista Circular Doblemente Enlazada para el sistema de alarmas.
Esta estructura permite navegación bidireccional y circular entre elementos.
"""

class Node:
    """
    Nodo de la lista circular doblemente enlazada.
    Cada nodo contiene datos y referencias a los nodos siguiente y anterior.
    """
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None
    
    def __repr__(self):
        return f"Node({self.data})"


class CircularDoublyLinkedList:
    """
    Lista Circular Doblemente Enlazada.
    
    Características:
    - El último nodo apunta al primero (circular)
    - El primer nodo apunta al último (circular)
    - Navegación bidireccional (next y prev)
    - Sin necesidad de verificar None en los extremos
    """
    
    def __init__(self):
        self.head = None
        self.size = 0
        self.current = None  # Puntero para navegación
    
    def is_empty(self):
        """Verifica si la lista está vacía"""
        return self.head is None
    
    def __len__(self):
        """Retorna el tamaño de la lista"""
        return self.size
    
    def insert_at_end(self, data):
        """
        Inserta un nuevo nodo al final de la lista.
        Mantiene las referencias circulares.
        """
        new_node = Node(data)
        
        if self.is_empty():
            # Primera inserción: el nodo apunta a sí mismo
            new_node.next = new_node
            new_node.prev = new_node
            self.head = new_node
            self.current = new_node
        else:
            # Obtener el último nodo (anterior al head)
            tail = self.head.prev
            
            # Insertar el nuevo nodo entre tail y head
            tail.next = new_node
            new_node.prev = tail
            new_node.next = self.head
            self.head.prev = new_node
        
        self.size += 1
        return new_node
    
    def insert_at_beginning(self, data):
        """
        Inserta un nuevo nodo al inicio de la lista.
        El nuevo nodo se convierte en el head.
        """
        new_node = self.insert_at_end(data)
        self.head = new_node
        return new_node
    
    def delete_by_id(self, id_value):
        """
        Elimina un nodo por su ID.
        Retorna True si se eliminó, False si no se encontró.
        """
        if self.is_empty():
            return False
        
        current = self.head
        found = False
        
        # Buscar el nodo a eliminar
        for _ in range(self.size):
            if current.data.get('id') == id_value:
                found = True
                break
            current = current.next
        
        if not found:
            return False
        
        # Caso especial: único nodo en la lista
        if self.size == 1:
            self.head = None
            self.current = None
        else:
            # Reconectar los nodos vecinos
            current.prev.next = current.next
            current.next.prev = current.prev
            
            # Si eliminamos el head, mover head al siguiente
            if current == self.head:
                self.head = current.next
            
            # Si eliminamos el current, mover a siguiente
            if current == self.current:
                self.current = current.next
        
        self.size -= 1
        return True
    
    def search_by_id(self, id_value):
        """
        Busca un nodo por su ID.
        Retorna los datos del nodo si se encuentra, None si no.
        """
        if self.is_empty():
            return None
        
        current = self.head
        for _ in range(self.size):
            if current.data.get('id') == id_value:
                return current.data
            current = current.next
        
        return None
    
    def update_by_id(self, id_value, new_data):
        """
        Actualiza los datos de un nodo por su ID.
        Retorna True si se actualizó, False si no se encontró.
        """
        if self.is_empty():
            return False
        
        current = self.head
        for _ in range(self.size):
            if current.data.get('id') == id_value:
                # Actualizar los datos manteniendo el ID original
                current.data.update(new_data)
                return True
            current = current.next
        
        return False
    
    def to_list(self):
        """
        Convierte la lista circular a una lista de Python normal.
        Útil para serialización JSON.
        """
        if self.is_empty():
            return []
        
        result = []
        current = self.head
        for _ in range(self.size):
            result.append(current.data)
            current = current.next
        
        return result
    
    def next_item(self):
        """
        Navega al siguiente elemento de forma circular.
        Retorna los datos del nodo actual después de moverse.
        """
        if self.is_empty():
            return None
        
        if self.current is None:
            self.current = self.head
        else:
            self.current = self.current.next
        
        return self.current.data
    
    def prev_item(self):
        """
        Navega al elemento anterior de forma circular.
        Retorna los datos del nodo actual después de moverse.
        """
        if self.is_empty():
            return None
        
        if self.current is None:
            self.current = self.head
        else:
            self.current = self.current.prev
        
        return self.current.data
    
    def get_current(self):
        """
        Retorna el elemento actual sin mover el puntero.
        """
        if self.current is None:
            return None
        return self.current.data
    
    def reset_current(self):
        """
        Reinicia el puntero de navegación al inicio de la lista.
        """
        self.current = self.head
        return self.get_current()
    
    def display_forward(self):
        """
        Retorna una representación de la lista navegando hacia adelante.
        Útil para debugging.
        """
        if self.is_empty():
            return "Lista vacía"
        
        items = []
        current = self.head
        for i in range(self.size):
            marker = " <- CURRENT" if current == self.current else ""
            marker += " <- HEAD" if current == self.head else ""
            items.append(f"{current.data}{marker}")
            current = current.next
        
        return " <-> ".join(items) + " <-> [circular]"
    
    def display_backward(self):
        """
        Retorna una representación de la lista navegando hacia atrás.
        Útil para debugging.
        """
        if self.is_empty():
            return "Lista vacía"
        
        items = []
        current = self.head.prev  # Empezar desde el final
        for i in range(self.size):
            marker = " <- CURRENT" if current == self.current else ""
            items.append(f"{current.data}{marker}")
            current = current.prev
        
        return " <-> ".join(items) + " <-> [circular]"
    
    def __repr__(self):
        return f"CircularDoublyLinkedList(size={self.size}, items={self.to_list()})"
