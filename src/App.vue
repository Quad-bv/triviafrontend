<template>
  <v-app>
    <ParticlesBackground />
    <RouterView />
  </v-app>
</template>

<script setup lang="ts">
import ParticlesBackground from "@/views/components/backgrounds/ParticlesBackground.vue";
</script>
