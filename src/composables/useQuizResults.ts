import { computed } from 'vue';
import { useQuizStore } from '@/composables/useQuizStore';

export function useQuizResults() {
    const quiz = useQuizStore();

    const totalQuestions = computed(() => quiz.questions.value.length);

    const correctAnswers = computed(() =>
        quiz.questions.value.filter(question => question.correct === true).length
    );

    const incorrectAnswers = computed(() =>
        quiz.questions.value.filter(question => question.correct === false).length
    );

    const scorePercentage = computed(() =>
        totalQuestions.value === 0
            ? 0
            : Math.round((correctAnswers.value / totalQuestions.value) * 100)
    );

    return {
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        scorePercentage,
    };
}
