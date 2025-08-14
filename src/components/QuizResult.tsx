import { CircleCheck, CircleX } from 'lucide-react'
import { useAppStore } from '../stores/quiz'

export function QuizResult() {
	const questions = useAppStore((state) => state.questions)
	const correctAnswers = useAppStore((state) => state.correctAnswers)
	const newQuiz = useAppStore((state) => state.newQuiz)

	return (
		<section>
			<h2>Results</h2>

			<ol>
				{questions.map((question) => (
					<li key={question.name}>
						{question.correct ? (
							<div className="flex line">
								<CircleCheck className="teal" /> Correct
							</div>
						) : (
							<div className="flex line">
								<CircleX className="pink" />
								Incorrect
							</div>
						)}{' '}
						<table>
							<thead>
								<tr>
									<th
										colSpan={Math.max(
											question.scale.length,
											question.answer.length,
										)}
									>
										{question.name}
										{question.modeName && (
											<>&nbsp;({question.modeName})</>
										)}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<CircleCheck className="teal line" />{' '}
										Correct Answers
									</td>
									{question.scale.map((interval) => (
										<td>{interval}</td>
									))}
								</tr>
								{!question.correct && (
									<tr>
										<td>
											<CircleX className="pink line" />{' '}
											Your Answer
										</td>
										{question.answer.map((interval) => (
											<td>{interval}</td>
										))}
									</tr>
								)}
							</tbody>
						</table>
						<b>Scale</b>:
						<br />
						<b>Intervals:</b>
					</li>
				))}
			</ol>

			<p>
				Final score:{' '}
				<b>{((correctAnswers / questions.length) * 100).toFixed(2)}%</b>
			</p>

			<button onClick={newQuiz}>Start a new quiz!</button>
		</section>
	)
}
