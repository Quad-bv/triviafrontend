<template>
  <v-radio-group
      v-model="selectedAnswer"
      hide-details
  >
    <v-radio
        v-for="answer in answersWithColors"
        :key="answer.text"
        :value="answer.text"
        :base-color="answer.color"
        :readonly="answer.guessed || isFinished || isChecking"
    >
      <template #label>
        <span :class="answer.color ? `text-${answer.color}` : ''">
          {{ answer.text }}
        </span>
      </template>
    </v-radio>
  </v-radio-group>

  <v-card-actions>
    <v-spacer/>
    <v-btn
        color="primary"
        size="large"
        min-width="160"
        :disabled="!selectedAnswer || isFinished || isChecking"
        :loading="isChecking"
        @click="onAnswerSelected"
    >
      Submit answer
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuizQuestion } from '@/composables/useQuizQuestion.ts';
import type { Answer, AnswerInput } from '@/models/Answer.ts';

const props = defineProps<{
  question: string;
  answers: AnswerInput[];
  verificationToken: string;
  maxAttempts?: number;
}>();

const emit = defineEmits<{
  answered: [correct: boolean];
}>();

const {
  selectedAnswer,
  isChecking,
  answers,
  isFinished,
  submitAnswer,
} = useQuizQuestion({
  question: props.question,
  answers: props.answers,
  verificationToken: props.verificationToken,
  maxAttempts: props.maxAttempts,
});

const answersWithColors = computed(() =>
    answers.value.map(answer => ({
      ...answer,
      color: getAnswerColor(answer),
    }))
);

function getAnswerColor(answer: Answer) {
  if (answer.correct === true) return 'green';
  if (answer.correct === false) return 'red';

  return undefined;
}

const onAnswerSelected = async () => {
  const correct = await submitAnswer(selectedAnswer.value);

  if (correct !== null) {
    emit('answered', correct);
  }
};
</script>
