import { Lightbulb } from 'lucide-react'
import { useAppStore } from '../stores/quiz'
import { QuizResult } from './QuizResult'
import { useEffect } from 'react'
import { getStepAsNotation, getStepAsNumber } from '../utils/scales'
import { isStep } from '../types'

export function StepQuizQuestion() {
	const addStep = useAppStore((state) => state.addStep)
	const clearSteps = useAppStore((state) => state.clearSteps)
	const questionIndex = useAppStore((state) => state.questionIndex)
	const questions = useAppStore((state) => state.questions)
	const correctAnswers = useAppStore((state) => state.correctAnswers)
	const selectedSteps = useAppStore((state) => state.selectedSteps)
	const submitAnswer = useAppStore((state) => state.submitAnswer)

	useEffect(() => {
		/** Handle keyboard short cut for pressing number keys to focus the corresponding step */
		function handleKeypress(ev: KeyboardEvent) {
			const keyAsNumber = Number(ev.key)
			if (
				isStep(keyAsNumber) &&
				!ev.metaKey &&
				!ev.altKey &&
				!ev.ctrlKey &&
				!ev.shiftKey
			) {
				const buttons: HTMLButtonElement[] = Array.from(
					document.querySelectorAll('button'),
				)
					.filter((input) => {
						return (
							input instanceof HTMLButtonElement &&
							input.textContent === getStepAsNotation(keyAsNumber)
						)
					})
					.map((input) => input as HTMLButtonElement)
				if (buttons.length === 1) {
					buttons[0].focus()
				} else if (buttons.length > 1) {
					const inputWithFocus = buttons.findIndex(
						(button) => button === document.activeElement,
					)
					if (inputWithFocus === -1) {
						buttons[0].focus()
					} else {
						let nextIndex = inputWithFocus + 1
						if (nextIndex >= buttons.length) {
							nextIndex = 0
						}
						buttons[nextIndex].focus()
					}
				}
			}
		}
		document.addEventListener('keypress', handleKeypress)
		return () => document.removeEventListener('keypress', handleKeypress)
	}, [])

	if (questionIndex === null) {
		return <QuizResult />
	}

	return (
		<div>
			<div>
				Question {questionIndex + 1} of {questions.length}. Current
				score: {correctAnswers / questions.length}
			</div>
			<p className="question">
				What are the steps for the{' '}
				<b>{questions[questionIndex].name}</b> scale?
			</p>
			<ol className="flex between steps">
				{selectedSteps.map((step, index) => (
					<li key={`${step}-${index}`} className="button--big">
						{getStepAsNotation(step)}
					</li>
				))}
				<li className="step-question button--big">?</li>
			</ol>
			<div className="flex between">
				{['W', 'H', 'W+H'].map((step) => (
					<button
						key={step}
						className="button--big"
						onClick={() => {
							addStep(getStepAsNumber(step))
						}}
						data-value={step}
					>
						{step}
					</button>
				))}
			</div>
			<div className="buttons">
				<button
					type="button"
					disabled={selectedSteps.length === 0}
					onClick={submitAnswer}
				>
					Submit
				</button>
			</div>

			<div className="tip">
				<Lightbulb />
				<div>
					You can press <kbd>1</kbd> for a half step, <kbd>2</kbd> for
					a whole step, and <kbd>3</kbd> for a whole + half step.
				</div>
			</div>
		</div>
	)
}
