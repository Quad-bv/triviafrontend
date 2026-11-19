import type { InjectionKey } from 'vue';
import type { IQuestionsService } from './interfaces/IQuestionsService';
import type { IAnswersService } from './interfaces/IAnswersService';

export const questionsServiceKey: InjectionKey<IQuestionsService> =
    Symbol('QuestionsService');

export const answersServiceKey: InjectionKey<IAnswersService> =
    Symbol('AnswersService');
