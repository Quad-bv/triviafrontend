import type {QuestionType} from "@/Model/Enum/QuestionType.ts";
import type {Difficulty} from "@/Model/Enum/Difficulty.ts";

export interface Question {
    type: QuestionType;
    difficulty: Difficulty;
    category: string;
    question: string;
    verificationToken: string;
    answers: string[];
}
