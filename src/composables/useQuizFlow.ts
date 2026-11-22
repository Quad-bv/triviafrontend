import { useQuizStore } from '@/composables/useQuizStore';

export function useQuizFlow() {
    const quiz = useQuizStore();

    function completeQuestion(correct: boolean): boolean {
        quiz.setQuestionResult(correct);

        const isQuizOver =
            quiz.currentQuestionNumber.value === quiz.questions.value.length;

        if (!isQuizOver) {
            quiz.nextQuestion();
        }

        return isQuizOver;
    }

    return {
        submitQuestionResult: completeQuestion,
    };
}
