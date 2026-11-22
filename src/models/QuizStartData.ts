import type {Difficulty} from "@/models/enums/Difficulty.ts";
import type {QuestionType} from "@/models/enums/QuestionType.ts";

export interface QuizStartData {
    amount: number;
    difficulty: Difficulty | null;
    type: QuestionType | null;
}
