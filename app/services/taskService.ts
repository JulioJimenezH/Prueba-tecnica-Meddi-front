import type { ITask, ICreateTask, IGenericResponse } from '~/types/task';

import { API_URL } from '~/constants';

export const taskService = {
 
  async getAll(): Promise<ITask[]> {
    const response = await $fetch<IGenericResponse<ITask[]>>(`${API_URL}/tasks`);
    return response.data;
  },
  
  async create(task: ICreateTask): Promise<ITask> {
    const response = await $fetch<IGenericResponse<ITask>>(`${API_URL}/tasks`, {
      method: 'POST',
      body: task
    });
    return response.data;
  },
 
  async update(id: string, task: Partial<ITask>): Promise<ITask> {
    const response = await $fetch<IGenericResponse<ITask>>(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      body: task
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await $fetch<IGenericResponse<void>>(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
  },
  
  async toggleStatus(id: string, currentStatus: string): Promise<ITask> {
    const newStatus = currentStatus === 'Pendiente' ? 'Completada' : 'Pendiente';
    return this.update(id, { estado: newStatus as any });
  }
};