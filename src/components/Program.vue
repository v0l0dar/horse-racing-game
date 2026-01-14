<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

defineOptions({
  name: 'ProgramSection',
})

const store = useGameStore()
const schedule = computed(() => store.schedule)
const currentRoundIndex = computed(() => store.currentRoundIndex)
</script>

<template>
  <div v-if="schedule.length === 0" data-test="empty-message" class="p-8 text-center text-gray-400 text-sm">
    No schedule generated.
  </div>

  <div v-else data-test="schedule-list" class="divide-y divide-blue-50">
    <div
      v-for="(round, index) in schedule"
      :key="round.roundId"
      data-test="round-item"
      class="p-3 transition-colors duration-300"
      :class="{
        'bg-blue-50 ring-2 ring-inset ring-blue-200': index === currentRoundIndex,
        'opacity-50 grayscale': index < currentRoundIndex,
      }"
    >
      <div class="flex justify-between items-center mb-2">
        <span data-test="round-id" class="font-bold text-sm text-gray-800">Round {{ round.roundId }}</span>
        <span
          data-test="round-distance"
          class="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
        >
          {{ round.distance }}m
        </span>
      </div>

      <div class="grid grid-cols-2 gap-x-2 gap-y-1">
        <div
          v-for="horse in round.horses"
          :key="horse.id"
          class="text-[10px] text-gray-500 flex items-center gap-1 truncate"
        >
          <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: horse.color }"></span>
          {{ horse.name }}
        </div>
      </div>
    </div>
  </div>
</template>
