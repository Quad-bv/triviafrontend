import type { CheckAnswersRequest } from '@/models/CheckAnswersRequest.ts';
import type { CheckAnswerResponse } from '@/models/CheckAnswerResponse.ts';
import ApiClient from "@/services/ApiClient.ts";
import type {IAnswersService} from "@/services/interfaces/IAnswersService.ts";

export default class AnswersService extends ApiClient implements IAnswersService {

    async checkAnswer(request: CheckAnswersRequest): Promise<CheckAnswerResponse> {
        return this.post<CheckAnswerResponse>('/checkanswers', request);
    }
}
