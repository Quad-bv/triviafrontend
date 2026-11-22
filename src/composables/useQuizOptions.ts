import { Difficulty } from '@/models/enums/Difficulty';
import { QuestionType } from '@/models/enums/QuestionType';

export function useQuizOptions() {
    const difficultyOptions = [
        { title: 'Any', value: 'any' },
        ...Object.values(Difficulty).map(value => ({
            title: value.charAt(0) + value.slice(1).toLowerCase(),
            value,
        })),
    ];

    const questionTypeOptions = [
        { title: 'Random', value: 'random' },
        ...Object.values(QuestionType).map(value => ({
            title: value === QuestionType.MULTIPLE
                ? 'Multiple choice'
                : 'True / False',
            value,
        })),
    ];

    return {
        difficultyOptions,
        questionTypeOptions,
    };
}
