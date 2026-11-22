import { computed } from 'vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Question } from '@/models/Question.ts';

// Private Pinia store
const quizStore = defineStore('quiz', () => {
    const questions = ref<Question[]>([]);
    const currentQuestionIndex = ref(0);

    return {
        questions,
        currentQuestionIndex,
    };
});

export function useQuizStore() {
    const quiz = quizStore();

    // State
    const questions = computed(() => quiz.questions);

    // Computed values
    const currentQuestion = computed(() =>
        quiz.questions[quiz.currentQuestionIndex] ?? null
    );

    const currentQuestionNumber = computed(() =>
        quiz.currentQuestionIndex + 1
    );

    // Actions
    function setQuestions(newQuestions: Question[]) {
        quiz.questions = newQuestions;
        quiz.currentQuestionIndex = 0;
    }

    function setQuestionResult(correct: boolean) {
        if (!currentQuestion.value) return;

        currentQuestion.value.correct = correct;
        currentQuestion.value.answered = true;
    }

    function nextQuestion() {
        if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
            quiz.currentQuestionIndex++;
        }
    }

    return {
        questions,
        currentQuestion,
        currentQuestionNumber,
        setQuestions,
        setQuestionResult,
        nextQuestion,
    };
}
