<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const horses = computed(() => store.state.horses)
</script>

<template>
  <header>Header</header>

  <main>
    <h2>Horses</h2>

    <ul>
      <li v-for="horse in horses" :key="horse">
        {{ horse }}
      </li>
    </ul>
  </main>
</template>
