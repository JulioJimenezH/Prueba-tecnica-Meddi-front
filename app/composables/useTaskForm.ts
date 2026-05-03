import { ref, reactive } from 'vue';
import type { ITask, ICreateTask } from '../types/task';
import { useTaskStore } from '../stores/taskStore';

const isModalOpen = ref(false);
const editingId = ref<string | null>(null);

const form = reactive<ICreateTask>({
  titulo: '',
  descripcion: '',
  prioridad: 'Media',
  fechaVencimiento: new Date().toISOString().split('T')[0] || '',
  estado: 'Pendiente'
});


export const useTaskForm = () => {

  const store = useTaskStore();
  const resetForm = () => {
    form.titulo = '';
    form.descripcion = '';
    form.prioridad = 'Media';
    form.fechaVencimiento = new Date().toISOString().split('T')[0] || '';
    form.estado = 'Pendiente';
    editingId.value = null;
  };

  const openCreate = () => {   
    resetForm();
    isModalOpen.value = true;    
  };

  const openEdit = (task: ITask) => {
    editingId.value = task.id;
    form.titulo = task.titulo;
    form.descripcion = task.descripcion;
    form.prioridad = task.prioridad;
    form.fechaVencimiento = task.fechaVencimiento ? (task.fechaVencimiento.split('T')[0] || '') :'';
    form.estado = task.estado;
    isModalOpen.value = true;
  };

  return {
    isModalOpen,
    editingId,
    form,
    resetForm,
    openCreate,
    openEdit
  };
};