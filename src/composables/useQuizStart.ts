import { ref } from 'vue';

import { useQuestionsService } from '@/composables/useQuestionsService';
import type { QuizStartData } from '@/models/QuizStartData';
import type { QuestionsResponse } from '@/models/QuestionsResponse';

export function useQuizStart() {
    const questionsService = useQuestionsService();

    const questions = ref<QuestionsResponse[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<Error | null>(null);

    async function startQuiz(data: QuizStartData) {
        loading.value = true;
        error.value = null;

        try {
            questions.value = await questionsService.getQuestions({
                amount: data.amount,
                ...(data.difficulty && { difficulty: data.difficulty }),
                ...(data.type && { type: data.type }),
            });
        } catch (err) {
            error.value = err instanceof Error
                ? err
                : new Error('Failed to retrieve questions.');
        } finally {
            loading.value = false;
        }
    }

    return {
        questions,
        loading,
        error,
        startQuiz,
    };
}
