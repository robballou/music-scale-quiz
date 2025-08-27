import { HelpCircle, Lightbulb } from 'lucide-react'
import { useAppStore } from '../stores/quiz'
import { QuizResult } from './QuizResult'
import { useCallback, useEffect, useMemo } from 'react'
import { getStepAsNotation, getStepAsNumber } from '../utils/scales'
import { isStep } from '../types'

export function StepQuizQuestion() {
	const addStep = useAppStore((state) => state.addStep)
	const clearSteps = useAppStore((state) => state.clearSteps)
	const removeStep = useAppStore((state) => state.removeStep)
	const questionIndex = useAppStore((state) => state.questionIndex)
	const questions = useAppStore((state) => state.questions)
	const selectedSteps = useAppStore((state) => state.selectedSteps)
	const submitAnswer = useAppStore((state) => state.submitAnswer)
	const showHelp = useAppStore((state) => state.showHelp)
	const displayHelp = useAppStore((state) => state.displayHelp)

	const removeStepFromAnswer = useCallback(
		(index: number) => () => removeStep(index),
		[removeStep],
	)

	/** Number of steps to display as unselected if the user uses the help function. */
	const helpSteps = useMemo(() => {
		if (questionIndex === null) {
			return 0
		}
		if (selectedSteps.length >= questions[questionIndex].steps.length) {
			return 0
		}

		return questions[questionIndex].steps.length - selectedSteps.length
	}, [questionIndex, questions, selectedSteps])

	useEffect(() => {
		/** Handle keyboard short cut for pressing number keys to focus the corresponding step */
		function handleKeypress(ev: KeyboardEvent) {
			const keyAsNumber = Number(ev.key)
			const noModifiersPressed =
				!ev.metaKey && !ev.altKey && !ev.ctrlKey && !ev.shiftKey
			if (isStep(keyAsNumber) && noModifiersPressed) {
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
					buttons[0].click()
				} else if (buttons.length > 1) {
					const inputWithFocus = buttons.findIndex(
						(button) => button === document.activeElement,
					)
					if (inputWithFocus === -1) {
						buttons[0].focus()
						buttons[0].click()
					} else {
						let nextIndex = inputWithFocus + 1
						if (nextIndex >= buttons.length) {
							nextIndex = 0
						}
						buttons[nextIndex].focus()
						buttons[nextIndex].click()
					}
				}
			} else if (
				(ev.key === 'Backspace' || ev.key === 'Delete') &&
				noModifiersPressed &&
				selectedSteps.length > 0
			) {
				// remove the last step
				removeStep(selectedSteps.length - 1)
			}
		}
		document.addEventListener('keydown', handleKeypress)
		return () => document.removeEventListener('keydown', handleKeypress)
	}, [removeStep, selectedSteps])

	if (questionIndex === null) {
		return <QuizResult />
	}

	return (
		<div>
			<div>
				Question {questionIndex + 1} of {questions.length}.
			</div>
			<p className="question">
				What are the steps for the{' '}
				<b>{questions[questionIndex].name}</b> scale?
			</p>
			<ol className="flex between steps">
				{selectedSteps.map((step, index) => (
					<li key={`${step}-${index}`} className="button--big">
						{getStepAsNotation(step)}
						<button
							type="button"
							className="button--remove"
							title="Click to remove this step"
							onClick={removeStepFromAnswer(index)}
						>
							x
						</button>
					</li>
				))}
				<li className="step-question button--big">?</li>
				{showHelp &&
					helpSteps - 1 > 0 &&
					[...Array(helpSteps - 1)].map((_value, index) => (
						<li className="step-question button--big" key={index}>
							?
						</li>
					))}
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
					className="button--help"
					disabled={showHelp}
					onClick={() => displayHelp()}
				>
					<HelpCircle />
				</button>
				<button
					type="button"
					disabled={selectedSteps.length === 0}
					onClick={clearSteps}
				>
					Clear
				</button>
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
