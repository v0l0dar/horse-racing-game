<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

const isRunning = computed(() => store.isRaceRunning)
const hasSchedule = computed(() => store.schedule.length > 0)
const isFinished = computed(() => store.isFinished)

const handleGenerate = () => {
  store.generateHorses()
  store.generateSchedule()
}

const handleStart = () => {
  store.startRace()
}
</script>

<template>
  <header class="bg-amber-500 text-white px-6 py-4 shadow-md flex justify-between items-center z-10">
    <h1 class="text-2xl font-bold tracking-wider flex items-center gap-2">
      <span class="text-4xl">🏇</span>
      Horse Racing
    </h1>
    <div class="flex gap-4">
      <button
        @click="handleGenerate"
        :disabled="isRunning"
        data-test="generate-btn"
        class="bg-white text-amber-600 px-6 py-2 rounded-full font-bold shadow hover:bg-amber-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Program
      </button>
      <button
        @click="handleStart"
        :disabled="isRunning || !hasSchedule || isFinished"
        data-test="start-btn"
        class="bg-green-600 text-white px-8 py-2 rounded-full font-bold shadow hover:bg-green-700 active:scale-95 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isRunning ? 'Racing...' : 'Start Race' }}
      </button>
    </div>
  </header>
</template>
