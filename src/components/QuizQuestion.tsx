import { useAppStore } from '../stores/quiz'
import { IntervalQuizQuestion } from './IntervalQuizQuestion'
import { QuizResult } from './QuizResult'
import { StepQuizQuestion } from './StepQuizQuestion'

export function QuizQuestion() {
	const questionIndex = useAppStore((state) => state.questionIndex)
	const questions = useAppStore((state) => state.questions)

	if (questionIndex === null) {
		return <QuizResult />
	} else if (questions[questionIndex].type === 'interval') {
		return <IntervalQuizQuestion />
	} else if (questions[questionIndex].type === 'step') {
		return <StepQuizQuestion />
	}
}
