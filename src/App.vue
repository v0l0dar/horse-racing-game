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

    <main class="flex-1 p-4 flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-4 lg:max-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] lg:overflow-hidden">

      <HorseList />

      <RaceTrack />

      <aside class="flex flex-col sm:flex-row lg:flex-row lg:col-span-4 gap-4 lg:h-full min-h-0">
        <Program class="flex-1 h-64 sm:h-auto lg:h-full" />
        <Results class="flex-1 h-64 sm:h-auto lg:h-full" />
      </aside>

    </main>
  </div>
</template>
