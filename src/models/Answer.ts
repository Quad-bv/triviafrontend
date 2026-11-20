export interface Answer {
    text: string;
    guessed: boolean;
    correct: boolean | null;
}

export type AnswerInput = Omit<Answer, 'correct'>;
