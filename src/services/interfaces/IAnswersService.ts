import type {CheckAnswersRequest} from "@/models/CheckAnswersRequest.ts";
import type {CheckAnswerResponse} from "@/models/CheckAnswerResponse.ts";


export interface IAnswersService {
    checkAnswer(request: CheckAnswersRequest): Promise<CheckAnswerResponse>;
}
