<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

const currentRound = computed(() => store.currentRound)
const positions = computed(() => store.currentRacePositions)

const getProgress = (id: number) => {
  const pos = positions.value.find(p => p.id === id)
  return pos ? pos.progress : 0
}
</script>

<template>
  <div class="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10 relative">
    <h2 class="font-bold text-gray-700">Race Track</h2>
    <div
      v-if="currentRound"
      data-test="round-info"
      class="text-sm font-mono bg-red-100 text-red-600 px-3 py-1 rounded-full border border-red-200"
    >
      Round {{ currentRound.roundId }} — {{ currentRound.distance }}m
    </div>
  </div>

  <div class="flex-1 bg-stone-100 relative overflow-hidden flex flex-col justify-center">
    <div
      v-if="!currentRound"
      data-test="empty-message"
      class="absolute inset-0 flex flex-col items-center justify-center text-gray-400"
    >
      <div class="text-6xl mb-4 opacity-50">🏟️</div>
      <p>Track is empty</p>
    </div>

    <div v-else data-test="track-lanes" class="w-full flex flex-col h-full">
      <div class="absolute right-12 top-0 bottom-0 w-2 border-l-2 border-dashed border-red-300 z-0">
        <div
          class="absolute top-0 left-0 text-xs text-red-600 font-bold tracking-widest uppercase rotate-90 origin-bottom-left"
        >
          Finish
        </div>
      </div>

      <div
        v-for="(horse, index) in currentRound.horses"
        :key="horse.id"
        data-test="horse-lane"
        class="flex-1 border-b border-gray-300/50 relative flex items-center bg-white/50"
      >
        <div
          class="w-8 h-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0 z-10"
        >
          <span class="-rotate-90">
            {{ Number(index) + 1 }}
          </span>
        </div>

        <div class="flex-1 relative h-full mx-4">
          <div
            class="absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear flex items-center gap-2"
            :style="{
              left: `calc(${getProgress(horse.id)}% - 2rem)`,
              zIndex: 10,
            }"
            :data-test="`horse-runner-${horse.id}`"
          >
            <div class="relative">
              <div class="text-3xl transform -scale-x-100 filter drop-shadow-sm">🐎</div>

              <div
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white"
                :style="{ backgroundColor: horse.color }"
              ></div>
            </div>

            <span
              class="text-[10px] font-bold text-gray-800 bg-white/80 px-1 rounded backdrop-blur-sm whitespace-nowrap shadow-sm border border-gray-200"
            >
              {{ horse.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
