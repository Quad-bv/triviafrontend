import { inject } from 'vue';
import { questionsServiceKey } from '@/services/ServiceKeys';

export function useQuestionsService() {
    const service = inject(questionsServiceKey);

    if (!service) {
        throw new Error('QuestionsService was not provided');
    }

    return service;
}
