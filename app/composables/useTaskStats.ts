import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '~/stores/taskStore';
import type { ITask } from '~/types/task';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');
export const useTaskStats = () => {
  const store = useTaskStore();
  const { tasks } = storeToRefs(store);

  // Gráficas
  const statsByPriority = computed(() => {
    const counts = { Alta: 0, Media: 0, Baja: 0 };
    tasks.value.forEach(t => {
      if (counts[t.prioridad] !== undefined) counts[t.prioridad]++;
    });    
    return [
      { name: 'Alta', Cantidad: counts.Alta },
      { name: 'Media', Cantidad: counts.Media },
      { name: 'Baja', Cantidad: counts.Baja }
    ];
  });

 const statsByStatus = computed(() => {
    const counts = { Pendiente: 0, Completada: 0 };
    tasks.value.forEach(t => {
      if (counts[t.estado] !== undefined) counts[t.estado]++;
    });
    return [
      { name: 'Pendiente', Cantidad: counts.Pendiente },
      { name: 'Completada', Cantidad: counts.Completada }
    ];
  });

  // Rankings
  const getTopDays = (filterFn: (t: ITask) => boolean, dateField: 'createdAt' | 'fechaVencimiento') => {
    const dayCounts: Record<string, number> = {};
    
    tasks.value.filter(filterFn).forEach(t => {
      const dateValue= t[dateField];
      if(!dateValue)return;

      let day = dayjs(dateValue as string).format('dddd');
      day = day.charAt(0).toUpperCase() + day.slice(1);
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    return Object.entries(dayCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([day, count]) => ({ day, count }));
  };

  const topDaysCreated = computed(() => getTopDays(() => true, 'createdAt'));
  const topDaysCompleted = computed(() => getTopDays(t => t.estado === 'Completada', 'createdAt'));

  return {
    statsByPriority,
    statsByStatus,
    topDaysCreated,
    topDaysCompleted
  };
};