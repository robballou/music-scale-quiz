import { createContext, useContext } from 'react'
import { createStore, type StoreApi, useStore } from 'zustand'
import type { ScaleWithAnswer } from '../types'
import { getQuestions } from '../utils/getQuestions'
import scales from '../scales.json'

type Props = {
	questions: ScaleWithAnswer[]
}

type StoreState = Props & {
	// any computed state can go here
	questionIndex: number | null
	selectedIntervals: Set<number | string>
	toggleInterval: (interval: number | string) => void
	submitAnswer: () => boolean
	newQuiz: () => void
	questionsAnswered: number
	correctAnswers: number
}

export type StoreProps = StoreState

export const createAppStore = (initialProps: Props) =>
	createStore<StoreState>()((set, get) => {
		return {
			...initialProps,
			questionsAnswered: 0,
			correctAnswers: 0,
			questionIndex: 0,
			selectedIntervals: new Set(),
			newQuiz: () => {
				set({
					questionsAnswered: 0,
					questionIndex: 0,
					selectedIntervals: new Set(),
					correctAnswers: 0,
					questions: getQuestions(scales.scales),
				})
			},
			toggleInterval: (interval: number | string) => {
				const newSelectedIntervals = new Set(get().selectedIntervals)
				if (!newSelectedIntervals.has(interval)) {
					newSelectedIntervals.add(interval)
				} else {
					newSelectedIntervals.delete(interval)
				}
				set({ selectedIntervals: newSelectedIntervals })
			},
			submitAnswer: () => {
				const selectedIntervals = get().selectedIntervals
				const currentQuestionIndex = get().questionIndex
				const questions = get().questions

				if (currentQuestionIndex === null) {
					return false
				}

				let isCorrect = false
				const scale = questions[currentQuestionIndex]
				const selectedAnswer = Array.from(selectedIntervals).sort()
				if (scale.scale.length === selectedIntervals.size) {
					const answer = scale.scale
						.map((value) => String(value))
						.sort()
					if (
						answer.every((value) => selectedAnswer.includes(value))
					) {
						isCorrect = true
					}
				}

				questions[currentQuestionIndex].correct = isCorrect
				questions[currentQuestionIndex].answer = selectedAnswer
				let nextPossibleIndex: number | null = currentQuestionIndex + 1
				if (nextPossibleIndex >= questions.length) {
					nextPossibleIndex = null
				}

				set({
					questionsAnswered: get().questionsAnswered + 1,
					correctAnswers: get().correctAnswers + (isCorrect ? 1 : 0),
					questionIndex: nextPossibleIndex,
					selectedIntervals: new Set(),
				})
				return isCorrect
			},
		}
	})
export const AppStoreContext = createContext<StoreApi<StoreState> | null>(null)

export function useAppStore<T>(selector: (state: StoreState) => T): T {
	const store = useContext(AppStoreContext)
	if (!store) {
		throw new Error('Missing AppStoreContext.Provider in the tree')
	}
	return useStore(store, selector)
}
