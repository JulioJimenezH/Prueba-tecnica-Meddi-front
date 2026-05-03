<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTaskStore } from '~/stores/taskStore';
import { useTaskForm } from '../../composables/useTaskForm';
import type { Priority } from '~/types/task';
import dayjs from 'dayjs';

const store = useTaskStore();
const { groupedTasks, loading } = storeToRefs(store);
const { openEdit } = useTaskForm();

// color según la prioridad
const getPriorityColor = (priority: Priority) => {
  const colors = {
    Alta: 'text-red-600 bg-red-50 border-red-200',
    Media: 'text-amber-600 bg-amber-50 border-amber-200',
    Baja: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  };
  return colors[priority];
};

// formato a las fechas en la lista
const formatDate = (date?: string) => {
  if (!date) return '';
  return dayjs(date).format('DD/MM/YYYY');
};
</script>

<template>
  <div class="space-y-8">
    <!-- Estado de Carga -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-muted-foreground animate-pulse">Cargando tareas ...</p>
    </div>    
    <div v-else v-for="(tasks, priority) in groupedTasks" :key="priority" class="space-y-4">
      
      <!-- Encabezado de Categoría -->
      <div v-if="tasks.length > 0" class="flex items-center gap-2">
        <span :class="['px-3 py-1 rounded-full text-xs font-bold border', getPriorityColor(priority as Priority)]">
          {{ priority }}
        </span>
        <div class="h-[1px] flex-1 bg-border"></div>
        <span class="text-xs text-muted-foreground">{{ tasks.length }} tareas</span>
      </div>      
      <div class="grid gap-3">
        <div v-for="task in tasks" :key="task.id" 
             class="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:shadow-md transition-all">
          
          <div class="flex items-center gap-4">
            <!-- Botón para completar -->
            <button @click="store.toggleStatus(task.id)" 
                    class="h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="task.estado === 'Completada' ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-500 hover:border-blue-400'">          
              <svg v-if="task.estado === 'Completada'" 
                   xmlns="http://www.w3.org/2000/svg" 
                   class="h-4 w-4" 
                   fill="none" 
                   viewBox="0 0 24 24" 
                   stroke="currentColor" 
                   stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <div>
              <h4 :class="['font-medium text-sm', task.estado === 'Completada' ? 'line-through text-muted-foreground' : '']">
                {{ task.titulo }}
              </h4>
              <p class="text-xs text-muted-foreground">{{ task.descripcion }}</p>
              
              <!-- Fechas -->
              <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] font-medium">
                <span class="text-gray-500 flex items-center gap-1">
                  📅 Creada: {{ formatDate(task.createdAt) }}
                </span>
                <span v-if="task.fechaVencimiento" 
                      class="flex items-center gap-1"
                      :class="task.estado === 'Pendiente' && dayjs(task.fechaVencimiento).isBefore(dayjs(), 'day') ? 'text-red-500' : 'text-blue-500'">
                  ⏰ Vence: {{ formatDate(task.fechaVencimiento) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEdit(task)" class="text-gray-400 hover:text-blue-500 transition-colors">
                <span class="text-xs font-bold">Editar</span>
            </button>
            <!-- Botón Eliminar -->
            <button @click="store.removeTask(task.id)" 
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <span class="text-xs font-bold">Eliminar</span>
            </button>            
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!loading && store.tasks.length === 0" class="text-center py-20 border-2 border-dashed rounded-2xl">
      <p class="text-muted-foreground">No hay tareas pendientes. ¡Buen trabajo!</p>
    </div>
  </div>
</template>