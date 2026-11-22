import { ref } from 'vue';

import { useQuestionsService } from '@/composables/services/useQuestionsService.ts';
import { useQuizStore } from '@/composables/useQuizStore.ts';
import { mapQuestions } from '@/mappers/QuestionMapper';

import type { QuizStartData } from '@/models/QuizStartData';

export function useQuizStart() {
    const questionsService = useQuestionsService();
    const quiz = useQuizStore();

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

            quiz.setQuestions(mapQuestions(response));
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
