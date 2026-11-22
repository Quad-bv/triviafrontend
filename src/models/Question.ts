import type { Answer } from '@/models/Answer';
import type {QuestionType} from "@/models/enums/QuestionType.ts";
import type {Difficulty} from "@/models/enums/Difficulty.ts";

export interface Question {
    type: QuestionType;
    difficulty: Difficulty;
    category: string;
    question: string;
    answers: Answer[];
    verificationToken: string;
    correct: boolean | null;
    answered: boolean;
}
