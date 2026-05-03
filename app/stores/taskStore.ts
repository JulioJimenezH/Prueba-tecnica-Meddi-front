import { defineStore } from 'pinia';
import { taskService } from '~/services/taskService';
import type { ICreateTask, ITask, Priority, Status } from '~/types/task';
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

export const useTaskStore = defineStore('task', () => {
  
  const tasks = ref<ITask[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Filtros globales
  const searchQuery = ref('');
  const selectedPriority = ref<Priority | 'Todas'>('Todas');
  
  // Filtros de Fecha y Orden
  const selectedDate = ref(''); 
  const sortOrder = ref<'desc' | 'asc'>('desc'); 

  // Filtrado Búsqueda, Prioridad y Fecha + Ordenamiento
const filteredTasks = computed(() => {    
    let result = tasks.value.filter(task => {      
      const matchTitle = task.titulo.toLowerCase().includes(searchQuery.value.toLowerCase());      
      
      const matchPriority = selectedPriority.value === 'Todas' || task.prioridad === selectedPriority.value;      
      let matchDate = true;
      if (selectedDate.value) {
        if (task.createdAt) {          
          const filterDate = dayjs(selectedDate.value).format('YYYY-MM-DD');
          const taskDate = dayjs(task.createdAt).format('YYYY-MM-DD');          
          matchDate = taskDate === filterDate;
        } else {
          matchDate = false;
        }
      }
      return matchTitle && matchPriority && matchDate;
    });    
    result.sort((a, b) => {      
      const dateA = dayjs(a.createdAt || 0).valueOf();
      const dateB = dayjs(b.createdAt || 0).valueOf();      
      return sortOrder.value === 'desc' 
        ? dateB - dateA 
        : dateA - dateB;
    });
    return result;
  });

  const groupedTasks = computed(() => {
    return {
      Alta: filteredTasks.value.filter(t => t.prioridad === 'Alta'),
      Media: filteredTasks.value.filter(t => t.prioridad === 'Media'),
      Baja: filteredTasks.value.filter(t => t.prioridad === 'Baja')
    };
  });

  
  async function loadTasks() {
    loading.value = true;
    try {
      const data = await taskService.getAll();     
      
      tasks.value = data.map(t => ({
        ...t,
        prioridad: (t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1).toLowerCase()) as Priority,
        estado: (t.estado.charAt(0).toUpperCase() + t.estado.slice(1).toLowerCase()) as 'Pendiente' | 'Completada'
      }));
      
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      error.value = 'No se pudieron cargar las tareas.';
    } finally {
      loading.value = false;
    }
  }

  async function addTask(newTask: ICreateTask) {
    loading.value = true;
    try {      
      await taskService.create(newTask);      
      await loadTasks();
    } catch (err) {
      console.error('Error al crear tarea:', err);
      error.value = 'No se pudo crear la tarea.';
    } finally {
      loading.value = false;
    }
  }

  async function updateTask(id: string, updatedData: ICreateTask) {
    loading.value = true;
    try {      
      await taskService.update(id, updatedData);       
      await loadTasks();
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      error.value = 'No se pudo actualizar la tarea.';
    } finally {
      loading.value = false;
    }
  }

  async function removeTask(id: string) {
    try {
      await taskService.delete(id);
      tasks.value = tasks.value.filter(t => t.id !== id);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  }

  
  async function toggleStatus(id: string) {    
    const taskToUpdate = tasks.value.find(t => t.id === id);
    if (!taskToUpdate) return;    
    const nuevoEstado = (taskToUpdate.estado === 'Pendiente' ? 'Completada' : 'Pendiente') as Status;    
    taskToUpdate.estado = nuevoEstado;

    try {      
      const payload: any = {
        id: taskToUpdate.id,
        titulo: taskToUpdate.titulo,
        descripcion: taskToUpdate.descripcion,
        prioridad: taskToUpdate.prioridad,
        fechaVencimiento: taskToUpdate.fechaVencimiento ? taskToUpdate.fechaVencimiento.split('T')[0] : '',
        estado: nuevoEstado
      };      
      await taskService.update(id, payload);      
      await loadTasks();
    } catch (err) {
      console.error('Error al cambiar el estado:', err);      
      taskToUpdate.estado = taskToUpdate.estado === 'Pendiente' ? 'Completada' : 'Pendiente';
    }
  }

  return {
    tasks,
    loading,
    searchQuery,
    selectedPriority,
    selectedDate,
    sortOrder,
    filteredTasks,
    groupedTasks,
    loadTasks,
    addTask,
    updateTask,
    removeTask,
    toggleStatus
  };
});