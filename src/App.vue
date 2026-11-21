<template>
  <v-app>
    <QuizQuestionCard
        :question="question"
        category="Chemistry"
        :difficulty="Difficulty.HARD"
        :question-number="1"
        :total-questions="6"
    >
      <MultipleChoiceQuestion
          :question="question"
          :answers="answers"
          :verification-token="verificationToken"
      />
    </QuizQuestionCard>
  </v-app>
</template>

<script lang="ts" setup>
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion.vue";
import QuizQuestionCard from "@/components/QuizQuestionCard.vue";
import type { AnswerInput } from "@/models/Answer.ts";
import { Difficulty } from "@/models/enums/Difficulty.ts";

const question = "On the periodic table of elements, what is the symbol for Tin?";

const verificationToken =
    "98a7f863a852b329af9c3fc1a2e062c44367482e9e1cbe5e9207a78b72083f70";

const answers: AnswerInput[] = [
  { text: "Ni" },
  { text: "Sn" },
  { text: "Au" },
  { text: "Na" },
];
</script>
