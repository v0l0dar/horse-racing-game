<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import HorseList from './components/HorseList.vue'
import RaceTrack from './components/RaceTrack.vue'
import Program from './components/Program.vue'
import Results from './components/Results.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans text-slate-800 flex flex-col">
    <TheHeader />

    <main class="flex-1 p-4 grid grid-cols-12 gap-4 max-h-[calc(100vh-80px)] h-[calc(100vh-80px)]">
      <HorseList />
      <RaceTrack />

      <aside class="col-span-4 flex gap-4 flex-1 h-full min-h-0">
        <Program />
        <Results />
      </aside>
    </main>
  </div>
</template>
