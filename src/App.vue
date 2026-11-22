<template>
  <v-app>
    <ParticlesBackground />
    <QuizStart />
    <QuizPage/>
  </v-app>
</template>

<script setup lang="ts">
import QuizPage from '@/views/pages/QuizPage.vue';
import ParticlesBackground from "@/views/components/backgrounds/ParticlesBackground.vue";
import QuizStart from "@/views/pages/QuizStart.vue";
</script>
