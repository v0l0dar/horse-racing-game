<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
const horses = computed(() => store.horses)
</script>

<template>
  <aside class="col-span-2 bg-white rounded-lg shadow-sm flex flex-col border border-gray-200 flex-1 h-full min-h-0 overflow-hidden">
    <div
      class="bg-gray-50 p-3 border-b border-gray-200 font-bold text-gray-700 text-center uppercase text-xs tracking-wider"
    >
      Horse List (1-20)
    </div>
    <div class="flex-1 overflow-y-auto custom-scrollbar">
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
    </div>
  </aside>
</template>
