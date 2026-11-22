import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Question } from '@/models/Question';

export const useQuizStore = defineStore('quiz', () => {
    const questions = ref<Question[]>([]);
    const currentQuestionIndex = ref(0);

    const currentQuestion = computed(() =>
        questions.value[currentQuestionIndex.value] ?? null
    );

    const currentQuestionNumber = computed(() =>
        currentQuestionIndex.value + 1
    );

    return {
        questions,
        currentQuestionIndex,
        currentQuestion,
        currentQuestionNumber,
    };
});
