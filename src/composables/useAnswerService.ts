import { inject } from 'vue';
import { answersServiceKey } from '@/services/ServiceKeys';

export function useAnswerService() {
    const service = inject(answersServiceKey);

    if (!service) {
        throw new Error('AnswerService was not provided');
    }

    return service;
}
