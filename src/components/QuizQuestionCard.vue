
<template>
  <v-card>
    <v-card-item>
      <v-card-subtitle>
        {{ category }}
      </v-card-subtitle>

      <template #append>
        <QuizProgress
            v-if="questionNumber !== undefined && totalQuestions !== undefined"
            :question-number="questionNumber"
            :total-questions="totalQuestions"
        />
      </template>

      <v-card-title>
        {{ question }}
      </v-card-title>

      <div>
        <v-chip
            :color="difficultyColor"
            size="small"
        >
          {{ difficulty }}
        </v-chip>
      </div>
    </v-card-item>

    <slot />
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Difficulty } from '@/models/enums/Difficulty.ts';
import QuizProgress from '@/components/QuizProgress.vue';

const props = defineProps<{
  question: string;
  category: string;
  difficulty: Difficulty;
  questionNumber?: number;
  totalQuestions?: number;
}>();

const difficultyColor = computed(() => {
  switch (props.difficulty) {
    case Difficulty.EASY:
      return 'green';
    case Difficulty.MEDIUM:
      return 'yellow';
    case Difficulty.HARD:
      return 'red';
  }
});
</script>
