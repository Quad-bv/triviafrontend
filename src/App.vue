<template>
  <v-app>
    <v-main>
      <MultipleChoiceQuestion
          :question="question"
          :answers="answers"
          :verification-token="verificationToken"
          :max-attempts="2"
      />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion.vue";
import type {AnswerInput} from "@/models/Answer.ts";

const question = "On the periodic table of elements, what is the symbol for Tin?";

const verificationToken =
    "98a7f863a852b329af9c3fc1a2e062c44367482e9e1cbe5e9207a78b72083f70";

const answers: AnswerInput[] = [
  { text: 'Ni', guessed: false },
  { text: 'Sn', guessed: false },
  { text: 'Ti', guessed: false },
  { text: 'Na', guessed: false },
];
</script>
