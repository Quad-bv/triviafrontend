
<template>
  <v-form
      ref="form"
      @submit.prevent="validateForm"
  >
    <v-col>
      <v-number-input
          v-model.number="amount"
          label="Number of questions"
          :min="1"
          :max="50"
          :step="1"
          variant="outlined"
          inset
          :rules="amountRules"
      />

      <v-select
          v-model="difficulty"
          label="Difficulty"
          placeholder="Any difficulty"
          :items="difficultyOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
      />

      <v-select
          v-model="type"
          label="Question type"
          placeholder="Any type"
          :items="questionTypeOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
      />

      <v-row justify="end">
        <Button
            :loading="loading"
            :disabled="loading"
            type="submit"
            variant="text"
        >
          Start quiz
        </Button>
      </v-row>
    </v-col>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { VForm } from 'vuetify/components';

import { Difficulty } from '@/models/enums/Difficulty';
import { QuestionType } from '@/models/enums/QuestionType';
import { useQuizOptions } from '@/composables/useQuizOptions';
import type {QuizStartData} from "@/models/QuizStartData.ts";
import Button from '@/views/components/generics/Button.vue';

const props = defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  start: [data: QuizStartData];
}>();

const form = ref<VForm | null>(null);

const amount = ref(10);

type DifficultyOption = Difficulty | 'any';
type QuestionTypeOption = QuestionType | 'random';
const difficulty = ref<DifficultyOption>('any');
const type = ref<QuestionTypeOption>('random');

const { difficultyOptions, questionTypeOptions } = useQuizOptions();

const amountRules = [
  (value: number | string | null) => {
    if (value === null || value === '') {
      return 'Number of questions is required.';
    }

    const number = Number(value);

    if (!Number.isInteger(number)) {
      return 'Please enter a whole number.';
    }

    if (number < 1) {
      return 'At least 1 question is required.';
    }

    if (number > 50) {
      return 'A maximum of 50 questions is allowed.';
    }

    return true;
  },
];

async function validateForm() {
  const result = await form.value?.validate();

  if (!result?.valid) return;

  emit('start', {
    amount: amount.value,
    difficulty: difficulty.value === 'any'
        ? null
        : difficulty.value,
    type: type.value === 'random'
        ? null
        : type.value,
  });
}
</script>
