<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar"

defineProps<{
  data: any[];
  index: string;
  categories: string[];
}>();
</script>

<template>
  
  <div class="h-[180px] w-full mt-2">
    <BarChart
      :data="data"
      :index="index"
      :categories="categories"
      :y-formatter="(tick) => {
        
        return typeof tick === 'number' ? Math.round(tick).toString() : ''
      }"
      class="h-full"
    />
  </div>
</template>