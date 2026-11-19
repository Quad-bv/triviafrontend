import type {Difficulty} from "@/Model/Enum/Difficulty.ts";
import type {QuestionType} from "@/Model/Enum/QuestionType.ts";

export interface QuestionsRequest {
    amount: number;
    category?: number;
    difficulty?: Difficulty;
    type?: QuestionType;
    token?: string;
}
