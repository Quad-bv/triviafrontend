import type {Difficulty} from "@/models/enums/Difficulty.ts";
import type {QuestionType} from "@/models/enums/QuestionType.ts";

export interface QuestionsRequest {
    amount: number;
    category?: number;
    difficulty?: Difficulty;
    type?: QuestionType;
    token?: string;
}
