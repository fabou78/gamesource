<script setup>
  import AppHeader from '@/components/navigation/AppHeader.vue'

  import { firstLoad } from './composables/auth'

  const { loading } = firstLoad()
</script>

<template>
  <!-- loader -->
  <div class="text-center m3" v-if="loading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else>
    <app-header />
    <router-view />
  </div>
</template>
