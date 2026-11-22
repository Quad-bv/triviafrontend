<template>
  <v-card
      color="transparent"
      variant="flat"
      class="w-[60%] min-h-[40vh] mx-auto my-auto p-8"
  >
    <v-card-item>
      <v-card-title class="text-h4 mb-2">
        Ready to test your knowledge?
      </v-card-title>

      <v-card-subtitle class="text-wrap">
        Customize your quiz, choose your difficulty and get started!
      </v-card-subtitle>
    </v-card-item>

    <QuizStartForm
        :loading="loading"
        @start="startQuiz"
    />

    <v-alert
        v-if="error"
        type="error"
        variant="tonal"
    >
      {{ error.message }}
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
import QuizStartForm from '@/views/components/quiz/QuizStartForm.vue';
import { useQuizStart } from '@/composables/useQuizStart';

const { questions, loading, error, startQuiz } = useQuizStart();
</script>
