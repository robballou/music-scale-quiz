import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import scales from '../scales.json'
import { AppStoreContext, createAppStore } from '../stores/quiz'
import { QuizQuestion } from '../components/QuizQuestion'
import { getQuestions } from '../utils/getQuestions'

export const Route = createFileRoute('/quiz')({
	component: RouteComponent,
})

function RouteComponent() {
	const questions = useMemo(() => {
		const questions = getQuestions(scales.scales)
		return createAppStore({ questions })
	}, [])

	return (
		<AppStoreContext.Provider value={questions}>
			<QuizQuestion />
		</AppStoreContext.Provider>
	)
}
