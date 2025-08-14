import { CircleCheck, CircleX } from 'lucide-react'
import { useAppStore } from '../stores/quiz'
import { getStepAsNotation } from '../utils/scales'

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
						{question.type === 'interval' && (
							<table>
								<thead>
									<tr>
										<th
											colSpan={Math.max(
												question.intervals.length,
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
										{question.intervals.map((interval) => (
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
						)}
						{question.type === 'step' && (
							<table>
								<thead>
									<tr>
										<th
											colSpan={Math.max(
												question.steps.length,
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
										{question.steps.map((step) => (
											<td>{getStepAsNotation(step)}</td>
										))}
									</tr>
									{!question.correct && (
										<tr>
											<td>
												<CircleX className="pink line" />{' '}
												Your Answer
											</td>
											{question.answer.map((step) => (
												<td>
													{getStepAsNotation(step)}
												</td>
											))}
										</tr>
									)}
								</tbody>
							</table>
						)}
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
