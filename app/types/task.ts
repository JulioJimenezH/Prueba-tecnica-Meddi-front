export type Priority = 'Baja' | 'Media' | 'Alta';
export type Status = 'Pendiente' | 'Completada';

export interface ITask {
  id: string;              
  titulo: string;
  descripcion: string;
  prioridad: Priority;
  createdAt: string;    
  fechaVencimiento: string;
  estado: Status;
}

// mi generic response de .net
export interface IGenericResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// tarea nueva 
export type ICreateTask = Omit<ITask, 'id' | 'createdAt'>;