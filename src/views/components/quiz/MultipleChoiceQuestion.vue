<template>
  <v-radio-group
    v-model="selectedAnswer"
    hide-details
  >
    <v-radio
      v-for="answer in answersWithColors"
      :key="answer.text"
      :base-color="answer.color"
      :readonly="answer.guessed || isFinished || isChecking"
      :value="answer.text"
    >
      <template #label>
        <span :class="answer.color ? `text-${answer.color}` : ''">
          {{ answer.text }}
        </span>
      </template>
    </v-radio>
  </v-radio-group>

  <v-card-actions>
    <v-spacer />

    <Button
      :disabled="!selectedAnswer || isFinished || isChecking"
      :loading="isChecking"
      @click="onAnswerSelected"
    >
      Submit answer
    </Button>
  </v-card-actions>

  <v-alert
    v-if="error"
    class="mb-4"
    type="error"
    variant="tonal"
  >
    {{ error.message }}
  </v-alert>
</template>

<script lang="ts" setup>
  import type { Answer, AnswerInput } from '@/models/Answer.ts'
  import { computed } from 'vue'
  import { useQuizQuestion } from '@/composables/useQuizQuestion.ts'
  import Button from '@/views/components/generics/Button.vue'

  const props = defineProps<{
    question: string
    answers: AnswerInput[]
    verificationToken: string
    maxAttempts?: number
  }>()

  const emit = defineEmits<{
    answered: [correct: boolean]
  }>()

  const {
    selectedAnswer,
    isChecking,
    answers,
    isFinished,
    error,
    submitAnswer,
  } = useQuizQuestion({
    question: props.question,
    answers: props.answers,
    verificationToken: props.verificationToken,
    maxAttempts: props.maxAttempts,
  })

  const answersWithColors = computed(() =>
    answers.value.map(answer => ({
      ...answer,
      color: getAnswerColor(answer),
    })),
  )

  function getAnswerColor (answer: Answer) {
    if (answer.correct === true) return 'green'
    if (answer.correct === false) return 'red'

    return undefined
  }

  async function onAnswerSelected () {
    const correct = await submitAnswer(selectedAnswer.value)

    if (correct !== null && isFinished.value) {
      emit('answered', correct)
    }
  }
</script>
