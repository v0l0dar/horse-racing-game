<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

defineOptions({
  name: 'ResultsSection',
})

const store = useStore()
const results = computed(() => store.state.results)
</script>

<template>
  <div v-if="results.length === 0" data-test="results-empty" class="p-8 text-center text-gray-400 text-sm">
    Waiting for results...
  </div>

  <div v-else data-test="results-list" class="p-3 space-y-4">
    <div
      v-for="res in results"
      :key="res.roundId"
      data-test="result-card"
      class="bg-white border border-gray-100 rounded shadow-sm overflow-hidden"
    >
      <div class="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
        <span class="font-bold text-sm text-gray-700">Round {{ res.roundId }}</span>
        <span class="text-xs text-gray-400">{{ res.distance }}m</span>
      </div>

      <div
        data-test="result-winner"
        class="px-3 py-2 bg-yellow-50/50 flex items-center gap-2 border-b border-yellow-100"
      >
        <span class="text-lg">🏆</span>
        <span class="text-sm font-bold text-yellow-800">{{ res.winner.name }}</span>
      </div>

      <div class="px-3 py-2">
        <ol class="list-decimal list-inside text-xs text-gray-600 space-y-1">
          <li v-for="horse in res.allResults" :key="horse.id" class="pl-1">
            {{ horse.name }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
