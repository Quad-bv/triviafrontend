<template>
  <v-card
    class="w-[60%] min-h-[40vh] mx-auto my-auto p-8 text-center"
    color="transparent"
    variant="flat"
  >
    <v-card-title>
      Quiz Results
    </v-card-title>

    <v-card-text>
      <v-card-subtitle>
        Your final score
      </v-card-subtitle>

      <v-card-title>
        {{ scorePercentage }}%
      </v-card-title>

      <v-card-subtitle>Total</v-card-subtitle>

      <v-card-title>
        {{ totalQuestions }}
      </v-card-title>

      <v-card-subtitle>Correct</v-card-subtitle>

      <v-card-title>
        {{ correctAnswers }}
      </v-card-title>

      <v-card-subtitle>Incorrect</v-card-subtitle>

      <v-card-title>
        {{ incorrectAnswers }}
      </v-card-title>
    </v-card-text>

    <v-card-actions class="justify-center">
      <Button @click="emit('restart')">
        Play Again
      </Button>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import { useQuizResult } from '@/composables/useQuizResult.ts'
  import Button from '@/views/components/generics/Button.vue'

  const emit = defineEmits<{
    restart: []
  }>()

  const {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    scorePercentage,
  } = useQuizResult()
</script>
