import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { AppStoreContext, createAppStore } from '../stores/quiz'
import { getQuestions } from '../utils/getQuestions'
import { scales } from '../utils/scales'
import { StepQuizQuestion } from '../components/StepQuizQuestion'

export const Route = createFileRoute('/quiz')({
	component: RouteComponent,
})

function RouteComponent() {
	const questions = useMemo(() => {
		const questions = getQuestions(scales)
		return createAppStore({ questions })
	}, [])

	return (
		<AppStoreContext.Provider value={questions}>
			<StepQuizQuestion />
		</AppStoreContext.Provider>
	)
}
