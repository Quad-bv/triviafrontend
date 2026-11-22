import type { Answer } from '@/models/Answer';

export interface Question {
    question: string;
    answers: Answer[];
    verificationToken: string;
    correct: boolean | null;
    answered: boolean;
}
