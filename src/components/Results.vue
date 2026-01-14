<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

defineOptions({
  name: 'ResultsSection',
})

const store = useGameStore()
const results = computed(() => store.results)
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

      <div class="px-3 py-2">
        <ol class="list-decimal list-inside text-xs text-gray-600 space-y-1">
          <li v-for="horse in res.allResults" :key="horse.id" class="pl-1">
            {{ horse.name }} <template v-if="horse.id === res.winner.id">🏆</template>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
