<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from './store'
import HorseList from './components/HorseList.vue'
import RaceTrack from './components/RaceTrack.vue'
import Program from './components/Program.vue'
import Results from './components/Results.vue'

const store = useStore()

const isRunning = computed(() => store.state.isRaceRunning)

const hasSchedule = computed(() => store.state.schedule.length > 0)
const isFinished = computed(() => store.getters.isFinished)

const handleGenerate = () => {
  store.dispatch('generateHorses')
  store.dispatch('generateSchedule')
}

const handleStart = () => {
  store.dispatch('startRace')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans text-slate-800 flex flex-col overflow-hidden">
    <header class="bg-amber-500 text-white px-6 py-4 shadow-md flex justify-between items-center z-10">
      <h1 class="text-2xl font-bold tracking-wider flex items-center gap-2">
        <span>🏇</span>
        Horse Racing
      </h1>
      <div class="flex gap-4">
        <button
          @click="handleGenerate"
          :disabled="isRunning"
          class="bg-white text-amber-600 px-6 py-2 rounded-full font-bold shadow hover:bg-amber-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Program
        </button>
        <button
          @click="handleStart"
          :disabled="isRunning || !hasSchedule || isFinished"
          class="bg-green-600 text-white px-8 py-2 rounded-full font-bold shadow hover:bg-green-700 active:scale-95 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isRunning ? 'Racing...' : 'Start Race' }}
        </button>
      </div>
    </header>

    <main class="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden h-[calc(100vh-80px)]">
      <aside class="col-span-2 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-gray-200">
        <div
          class="bg-gray-50 p-3 border-b border-gray-200 font-bold text-gray-700 text-center uppercase text-xs tracking-wider"
        >
          Horse List (1-20)
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <HorseList />
        </div>
      </aside>

      <section class="col-span-6 flex flex-col gap-4">
        <div class="flex-1 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col">
          <RaceTrack />
        </div>
      </section>

      <aside class="col-span-4 flex gap-4 h-full">
        <div class="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-gray-200 h-1/2">
          <div
            class="bg-blue-50 p-3 border-b border-blue-100 font-bold text-blue-800 text-center uppercase text-xs tracking-wider"
          >
            Program
          </div>
          <div class="flex-1 overflow-y-auto">
            <Program />
          </div>
        </div>

        <div class="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-gray-200 h-1/2">
          <div
            class="bg-green-50 p-3 border-b border-green-100 font-bold text-green-800 text-center uppercase text-xs tracking-wider"
          >
            Results
          </div>
          <div class="flex-1 overflow-y-auto">
            <Results />
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>
