
<template>
  <v-card>
    <v-card-text>
      <v-radio-group
          v-model="selectedAnswer"
          hide-details
          @update:model-value="onAnswerSelected"
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuizQuestion } from '@/composables/useQuizQuestion.ts';
import type { Answer, AnswerInput } from '@/models/Answer';

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

// Determine answer colors for presentation
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

const onAnswerSelected = async (answer: string | null) => {
  const correct = await submitAnswer(answer);

  if (correct !== null) {
    emit('answered', correct);
  }
};
</script>
