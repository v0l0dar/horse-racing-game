<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const horses = computed(() => store.state.horses)
</script>

<template>
  <div v-if="horses.length === 0" class="p-8 text-center text-gray-400 text-sm" data-test="horse-list-empty">
    No horses loaded.
    <br />
    Click "Generate".
  </div>

  <ul v-else class="divide-y divide-gray-100" data-test="horse-list">
    <li
      v-for="horse in horses"
      :key="horse.id"
      data-test="horse-item"
      class="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-center gap-3">
        <div class="w-4 h-4 rounded shadow-sm border border-black/10" :style="{ backgroundColor: horse.color }"></div>
        <span class="text-sm font-medium text-gray-700">{{ horse.name }}</span>
      </div>
      <div class="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">C:{{ horse.condition }}</div>
    </li>
  </ul>
</template>
