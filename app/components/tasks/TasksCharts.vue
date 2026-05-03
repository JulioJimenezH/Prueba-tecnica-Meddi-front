<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskStats } from '~/composables/useTaskStats';
import BarChart from '../common/BarChart.vue';

const { statsByPriority, statsByStatus, topDaysCreated,topDaysCompleted } = useTaskStats();
const activeTab = ref<'creadas' | 'completadas'>('creadas');
const currentRanking = computed(() => {
  return activeTab.value === 'creadas' ? topDaysCreated.value : topDaysCompleted.value;
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <!-- Card de Gráfica por Prioridad -->
    <div class="p-4 bg-card rounded-xl border shadow-sm flex flex-col">
      <h3 class="text-sm font-medium mb-2">Distribución por Prioridad</h3>
      <BarChart 
        :data="statsByPriority" 
        index="name" 
        :categories="['Cantidad']" 
      />
    </div>

    <!-- Card de Gráfica por Estado -->
  <div class="p-4 bg-card rounded-xl border shadow-sm flex flex-col">
      <h3 class="text-sm font-medium mb-2">Tareas por Estado</h3>
      <BarChart 
        :data="statsByStatus" 
        index="name" 
        :categories="['Cantidad']" 
      />
    </div>

    <!-- Card de Rankings con Pestañas -->
    <div class="p-4 bg-card rounded-xl border shadow-sm flex flex-col">     
      
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-medium text-primary">Top 3 Días</h3>        
        <div class="flex gap-1 text-[10px] bg-slate-800/50 p-1 rounded-md border border-border/50">
          <button 
            @click="activeTab = 'creadas'" 
            class="px-2 py-1 rounded transition-colors"
            :class="activeTab === 'creadas' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'">
            Creadas
          </button>
          <button 
            @click="activeTab = 'completadas'" 
            class="px-2 py-1 rounded transition-colors"
            :class="activeTab === 'completadas' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'">
            Completadas
          </button>
        </div>
      </div>      
      <ul class="space-y-3">
        <li v-for="(item, index) in currentRanking" :key="index" 
            class="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0">
          <span class="font-medium text-slate-200">{{ item.day }}</span>
          <span class="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {{ item.count }} {{ item.count === 1 ? 'tarea' : 'tareas' }}
          </span>
        </li>
      </ul>      
      <div v-if="currentRanking.length === 0" class="text-center text-xs text-gray-500 mt-4">
        No hay datos suficientes.
      </div>
    </div>
  </div>
</template>