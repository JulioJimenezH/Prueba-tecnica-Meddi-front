<script setup lang="ts">
import { useTaskStore } from '~/stores/taskStore';
import { useTaskForm } from '~/composables/useTaskForm';

const { isModalOpen, form, editingId } = useTaskForm();
const store = useTaskStore();

//agregar y actualizar
const handleSubmit = async () => {
  try {
    if (editingId.value) {      
      await store.updateTask(editingId.value, form);
    } else {      
      await store.addTask(form);
    }    
    isModalOpen.value = false;
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
};

</script>

<template>
  <ClientOnly>
  <Teleport to="body">    
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      
      
      <div class="bg-[#1e1e24] w-full max-w-md p-6 rounded-xl border border-gray-800 shadow-2xl">
        <h2 class="text-xl font-bold text-white mb-4">
          {{ editingId ? 'Editar Tarea' : 'Nueva Tarea' }}
        </h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Título</label>
            <input 
              v-model="form.titulo" 
              required 
              type="text" 
              placeholder="Ej. Configurar servidor..."
              class="w-full bg-[#141418] border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
            <textarea 
              v-model="form.descripcion" 
              required 
              rows="3"
              placeholder="Detalles de la tarea..."
              class="w-full bg-[#141418] border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            ></textarea>
          </div>

          <div class="flex gap-4">
            
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-400 mb-1">Prioridad</label>
              <select 
                v-model="form.prioridad" 
                class="w-full bg-[#141418] border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-400 mb-1">Vencimiento</label>
              <input 
                v-model="form.fechaVencimiento" 
                required 
                type="date" 
                class="w-full bg-[#141418] border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
            <button 
              type="button" 
              @click="isModalOpen = false" 
              class="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition-colors"
            >
              Guardar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
  </ClientOnly>
</template>