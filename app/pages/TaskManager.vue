<script setup lang="ts">
import { onMounted } from 'vue';
import { useTaskStore } from '~/stores/taskStore';
import { useTaskForm } from '~/composables/useTaskForm';
import TaskModal from '../components/tasks/TaskModal.vue';

const { openCreate } = useTaskForm();

const store = useTaskStore();
onMounted(async () => {
  await store.loadTasks();
});
</script>

<template>
  <div>
  <GPageContainer>
    
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Administrador de tareas</h1>      
      
      <button @click="openCreate" class="bg-blue-500 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-600 transition-colors">
        + Nueva Tarea
      </button>
    </div>    
    
      <div class="space-y-8">      
        <TasksCharts />      
        <TaskFilters />      
        <TaskList />
      </div>
    </GPageContainer>
  <TaskModal />
  </div>
</template>
