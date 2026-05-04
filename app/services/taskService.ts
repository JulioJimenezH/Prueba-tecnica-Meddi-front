import type { ITask, ICreateTask, IGenericResponse } from '~/types/task';

export const taskService = {

  getApiBase() {
    return useRuntimeConfig().public.apiBase;
  },

  async getAll(): Promise<ITask[]> {    
    const response = await $fetch<IGenericResponse<ITask[]>>(`${this.getApiBase()}/tasks`);
    return response.data;
  }, 
  
  async create(task: ICreateTask): Promise<ITask> {
    const response = await $fetch<IGenericResponse<ITask>>(`${this.getApiBase()}/tasks`, {
      method: 'POST',
      body: task
    });
    return response.data;
  },
 
  async update(id: string, task: Partial<ITask>): Promise<ITask> {
    const response = await $fetch<IGenericResponse<ITask>>(`${this.getApiBase()}/tasks/${id}`, {
      method: 'PUT',
      body: task
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await $fetch<IGenericResponse<void>>(`${this.getApiBase()}/tasks/${id}`, {
      method: 'DELETE'
    });
  },
  
  async toggleStatus(id: string, currentStatus: string): Promise<ITask> {
    const newStatus = currentStatus === 'Pendiente' ? 'Completada' : 'Pendiente';
    return this.update(id, { estado: newStatus as any });
  }
};