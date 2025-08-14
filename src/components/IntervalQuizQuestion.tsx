import { CheckSquare, Lightbulb, Square } from 'lucide-react'
import { useAppStore } from '../stores/quiz'
import { QuizResult } from './QuizResult'
import { useEffect } from 'react'

export function IntervalQuizQuestion() {
	const toggleInterval = useAppStore((state) => state.toggleInterval)
	const questionIndex = useAppStore((state) => state.questionIndex)
	const questions = useAppStore((state) => state.questions)
	const correctAnswers = useAppStore((state) => state.correctAnswers)
	const selectedIntervals = useAppStore((state) => state.selectedIntervals)
	const submitAnswer = useAppStore((state) => state.submitAnswer)

	useEffect(() => {
		/** Handle keyboard short cut for pressing number keys to focus the corresponding interval */
		function handleKeypress(ev: KeyboardEvent) {
			const keys = ['1', '2', '3', '4', '5', '6', '7']
			if (
				keys.includes(ev.key) &&
				!ev.metaKey &&
				!ev.altKey &&
				!ev.ctrlKey &&
				!ev.shiftKey
			) {
				const buttons: HTMLButtonElement[] = Array.from(
					document.querySelectorAll('button[aria-selected]'),
				)
					.filter((input) => {
						console.log({ input })
						return (
							input instanceof HTMLButtonElement &&
							input.dataset.value &&
							input.dataset.value.includes(ev.key)
						)
					})
					.map((input) => input as HTMLButtonElement)
				if (buttons.length === 1) {
					buttons[0].focus()
				} else {
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
				What are the intervals for the{' '}
				<b>{questions[questionIndex].name}</b>?
			</p>
			<div className="flex between">
				{[
					'1',
					'2',
					'♭2',
					'3',
					'♭3',
					'4',
					'♭4',
					'♯4',
					'5',
					'♭5',
					'♯5',
					'6',
					'♭6',
					'7',
					'♭7',
				].map((interval) => (
					<button
						key={interval}
						className="button--checkbox"
						aria-selected={
							selectedIntervals.has(interval) ? 'true' : 'false'
						}
						onClick={() => {
							toggleInterval(interval)
						}}
						data-value={interval}
					>
						{selectedIntervals.has(interval) ? (
							<CheckSquare />
						) : (
							<Square />
						)}
						{interval}
					</button>
				))}
			</div>
			<div className="buttons">
				<button
					type="button"
					disabled={selectedIntervals.size === 0}
					onClick={submitAnswer}
				>
					Submit
				</button>
			</div>

			<div className="tip">
				<Lightbulb /> You can press a number key to focus on one of the
				buttons. Press a number key multiple times to cycle through all
				available intervals for that number. Press space or enter to
				toggle the selection.
			</div>
		</div>
	)
}
