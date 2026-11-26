import type { IAnswersService } from './interfaces/IAnswersService'
import type { IQuestionsService } from './interfaces/IQuestionsService'
import type { InjectionKey } from 'vue'

export const questionsServiceKey: InjectionKey<IQuestionsService>
  = Symbol('QuestionsService')

export const answersServiceKey: InjectionKey<IAnswersService>
  = Symbol('AnswersService')
