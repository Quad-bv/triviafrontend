import type { Question } from '@/models/Question.ts';
import type { QuestionsRequest } from '@/models/QuestionsRequest.ts';
import ApiClient from "@/services/ApiClient.ts";
import type {IQuestionsService} from "@/services/interfaces/IQuestionsService.ts";

export default class QuestionsService extends ApiClient implements IQuestionsService{

    async getQuestions(request: QuestionsRequest): Promise<Question[]> {
        const params = new URLSearchParams();

        params.set('amount', String(request.amount));

        if (request.category !== undefined) params.set('category', String(request.category));
        if (request.difficulty) params.set('difficulty', request.difficulty);
        if (request.type) params.set('type', request.type);
        if (request.token) params.set('token', request.token);

        return this.get<Question[]>(`/questions?${params.toString()}`);
    }
}
