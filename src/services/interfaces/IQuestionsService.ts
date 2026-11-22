import type {QuestionsRequest} from "@/models/QuestionsRequest.ts";
import type {QuestionsResponse} from "@/models/QuestionsResponse.ts";


export interface IQuestionsService {
    getQuestions(request: QuestionsRequest): Promise<QuestionsResponse[]>;
}
