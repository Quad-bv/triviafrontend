
<template>
  <v-card class="space-y-4">
    <v-card-item>
      <v-card-subtitle class="mb-2">
        {{ category }}
      </v-card-subtitle>

      <template #append>
        <QuizProgressCircle
            v-if="questionNumber !== undefined && totalQuestions !== undefined"
            :question-number="questionNumber"
            :total-questions="totalQuestions"
        />
      </template>

      <v-card-title class="text-wrap mb-2">
        {{ question }}
      </v-card-title>

      <div>
        <v-chip :color="difficultyColor" size="small">
          {{ difficulty }}
        </v-chip>
      </div>
    </v-card-item>

    <QuizProgressBar
        v-if="questionNumber !== undefined && totalQuestions !== undefined"
        :question-number="questionNumber"
        :total-questions="totalQuestions"
    />

    <div>
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Difficulty } from '@/models/enums/Difficulty.ts';
import QuizProgressCircle from '@/views/components/QuizProgressCircle.vue';
import QuizProgressBar from "@/views/components/QuizProgressBar.vue";

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
