<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTaskStore } from '~/stores/taskStore';

const store = useTaskStore();
const { searchQuery, selectedPriority, selectedDate, sortOrder } = storeToRefs(store);
const clearDate = () => {
  selectedDate.value = '';
};
</script>

<template>
  
  <div class="flex flex-col gap-4 mb-6 p-4 bg-card rounded-xl border shadow-sm">  
    
    <div class="flex flex-col sm:flex-row gap-4">      
      <div class="flex-1">
        <label for="search" class="text-sm font-medium text-muted-foreground mb-1 block">
          Buscar tareas
        </label>
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Ej. Revisar servidor..."
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>      
      <div class="w-full sm:w-56">
        <label for="priority" class="text-sm font-medium text-muted-foreground mb-1 block">
          Filtrar por Prioridad
        </label>
        <select
          id="priority"
          v-model="selectedPriority"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Todas">Todas las prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>
    </div>

    <!-- FILA 2: Fechas y Orden (Nuevos campos) -->
    <div class="flex flex-col sm:flex-row gap-4">
      
      <!-- Input de Fecha con botón para limpiar -->
      <div class="flex-1">
        <label for="date" class="text-sm font-medium text-muted-foreground mb-1 block">
          Filtrar por Fecha de Creación
        </label>
        <div class="flex gap-2">
          <input
            id="date"
            v-model="selectedDate"
            type="date"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            v-if="selectedDate"
            @click="clearDate"
            class="flex items-center justify-center h-10 px-3 bg-red-500/10 text-red-500 rounded-md border border-red-500/20 hover:bg-red-500/20 transition-colors"
            title="Borrar filtro de fecha"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Select de Ordenamiento -->
      <div class="w-full sm:w-56">
        <label for="sort" class="text-sm font-medium text-muted-foreground mb-1 block">
          Ordenar por Creación
        </label>
        <select
          id="sort"
          v-model="sortOrder"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguas primero</option>
        </select>
      </div>
    </div>

  </div>
</template>