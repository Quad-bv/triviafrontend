import type {QuestionsRequest} from "@/models/QuestionsRequest.ts";
import type {Question} from "@/models/Question.ts";


export interface IQuestionsService {
    getQuestions(request: QuestionsRequest): Promise<Question[]>;
}
