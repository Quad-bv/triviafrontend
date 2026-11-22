<template>
  <v-card
      color="transparent"
      variant="flat"
      class="w-[60%] min-h-[40vh] mx-auto my-auto p-8"
  >
    <v-card-item>
      <v-card-title>
        Ready to test your knowledge?
      </v-card-title>

      <v-card-subtitle class="text-wrap">
        Customize your quiz, choose your difficulty and get started!
      </v-card-subtitle>
    </v-card-item>

    <QuizStartForm
        :loading="loading"
        @start="onStartQuiz"
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
import type {QuizStartData} from "@/models/QuizStartData.ts";

const emit = defineEmits<{
  started: [];
}>();

const { loading, error, startQuiz } = useQuizStart();

async function onStartQuiz(data: QuizStartData) {
  await startQuiz(data);

  if (!error.value) {
    emit('started');
  }
}
</script>
