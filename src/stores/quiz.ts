import { createContext, useContext } from 'react'
import { createStore, type StoreApi, useStore } from 'zustand'
import type { ScaleQuestion } from '../types'
import { getQuestions } from '../utils/getQuestions'
import { scales } from '../utils/scales'

type Props = {
	questions: ScaleQuestion[]
}

type StoreState = Props & {
	// any computed state can go here
	questionIndex: number | null

	// for interval based quiz questions
	selectedIntervals: Set<number | string>
	toggleInterval: (interval: number | string) => void

	// for step based quiz questions
	selectedSteps: (1 | 2 | 3)[]
	addStep: (step: 1 | 2 | 3) => void
	removeStep: (position: number) => void
	clearSteps: () => void

	submitAnswer: () => boolean
	newQuiz: () => void
	/** Number of questions the player has answered. */
	questionsAnswered: number
	/** Number of correct answers. */
	correctAnswers: number
	/** Number of times the player used the help function. */
	usedHelp: number

	showHelp: boolean
	displayHelp: () => void
}

export type StoreProps = StoreState

export const createAppStore = (initialProps: Props) =>
	createStore<StoreState>()((set, get) => {
		return {
			...initialProps,
			questionsAnswered: 0,
			correctAnswers: 0,
			questionIndex: 0,
			usedHelp: 0,
			showHelp: false,

			displayHelp() {
				set({ showHelp: true, usedHelp: get().usedHelp + 1 })
			},

			newQuiz: () => {
				set({
					questionsAnswered: 0,
					questionIndex: 0,
					selectedIntervals: new Set(),
					correctAnswers: 0,
					questions: getQuestions(scales),
					showHelp: false,
					usedHelp: 0,
				})
			},

			// Interval based questions
			selectedIntervals: new Set(),
			toggleInterval: (interval: number | string) => {
				const newSelectedIntervals = new Set(get().selectedIntervals)
				if (!newSelectedIntervals.has(interval)) {
					newSelectedIntervals.add(interval)
				} else {
					newSelectedIntervals.delete(interval)
				}
				set({ selectedIntervals: newSelectedIntervals })
			},

			// step based questions
			selectedSteps: [],
			addStep(step) {
				set({ selectedSteps: [...get().selectedSteps, step] })
			},
			removeStep(position) {
				const newSteps = [...get().selectedSteps]
				if (position < newSteps.length) {
					newSteps.splice(position, 1)
				}
				set({ selectedSteps: newSteps })
			},
			clearSteps() {
				set({ selectedSteps: [] })
			},

			submitAnswer() {
				const currentQuestionIndex = get().questionIndex
				const questions = get().questions

				if (currentQuestionIndex === null) {
					return false
				}

				let isCorrect = false
				const scale = questions[currentQuestionIndex]

				if (scale.type === 'interval') {
					const selectedIntervals = get().selectedIntervals
					const selectedAnswer = Array.from(selectedIntervals).sort()
					if (scale.intervals.length === selectedIntervals.size) {
						const answer = scale.intervals
							.map((value) => String(value))
							.sort()
						if (
							answer.every((value) =>
								selectedAnswer.includes(value),
							)
						) {
							isCorrect = true
						}
					}

					questions[currentQuestionIndex].correct = isCorrect
					questions[currentQuestionIndex].answer = selectedAnswer
					let nextPossibleIndex: number | null =
						currentQuestionIndex + 1
					if (nextPossibleIndex >= questions.length) {
						nextPossibleIndex = null
					}

					set({
						questionsAnswered: get().questionsAnswered + 1,
						correctAnswers:
							get().correctAnswers + (isCorrect ? 1 : 0),
						questionIndex: nextPossibleIndex,
						selectedIntervals: new Set(),
						showHelp: false,
					})
				} else {
					const selectedSteps = get().selectedSteps
					if (scale.steps.length === selectedSteps.length) {
						let matches = true
						for (
							let index = 0;
							index < scale.steps.length;
							index++
						) {
							if (scale.steps[index] !== selectedSteps[index]) {
								matches = false
								break
							}
						}
						isCorrect = matches
					}

					questions[currentQuestionIndex].correct = isCorrect
					questions[currentQuestionIndex].answer = selectedSteps
					let nextPossibleIndex: number | null =
						currentQuestionIndex + 1
					if (nextPossibleIndex >= questions.length) {
						nextPossibleIndex = null
					}

					set({
						questionsAnswered: get().questionsAnswered + 1,
						correctAnswers:
							get().correctAnswers + (isCorrect ? 1 : 0),
						questionIndex: nextPossibleIndex,
						selectedSteps: [],
						showHelp: false,
					})
				}

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
