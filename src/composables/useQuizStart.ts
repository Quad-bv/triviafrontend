import { ref } from 'vue';

import { useQuestionsService } from '@/composables/useQuestionsService';
import { useQuizStore } from '@/stores/quiz';
import { mapQuestions } from '@/mappers/QuestionMapper';

import type { QuizStartData } from '@/models/QuizStartData';

export function useQuizStart() {
    const questionsService = useQuestionsService();
    const quizStore = useQuizStore();

    const loading = ref<boolean>(false);
    const error = ref<Error | null>(null);

    async function startQuiz(data: QuizStartData) {
        loading.value = true;
        error.value = null;

        try {
            const response = await questionsService.getQuestions({
                amount: data.amount,
                ...(data.difficulty && { difficulty: data.difficulty }),
                ...(data.type && { type: data.type }),
            });

            quizStore.questions = mapQuestions(response);
        } catch (err) {
            error.value = err instanceof Error
                ? err
                : new Error('Failed to retrieve questions.');
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        startQuiz,
    };
}
