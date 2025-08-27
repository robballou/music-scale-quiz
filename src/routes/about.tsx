import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { scales } from '../utils/scales'

export const Route = createFileRoute('/about')({
	component: RouteComponent,
})

function RouteComponent() {
	const scaleNames = useMemo(() => {
		const set = new Set<string>()
		Object.values(scales).forEach((scale) => {
			set.add(scale.name)
		})
		const scaleNames = Array.from(set)
		scaleNames.sort((a, b) => a.localeCompare(b))
		return scaleNames
	}, [])
	return (
		<div>
			<h2>A quiz to help me learn</h2>
			<p>
				I can often learn better by building things, writing things
				down, or combining the two into an outlet which helps me learn
				music scales. This quiz tool currently helps learns the "steps"
				between notes in a given scale.
			</p>
			<p>Currently supported scales:</p>
			<ul>
				{scaleNames.map((scaleName) => (
					<li>{scaleName}</li>
				))}
			</ul>

			<Link to="/quiz" className="link--button extra-padding">
				Start a new quiz!
			</Link>

			<p>
				<b>Note:</b> this tool is not meant for quizzes which may take
				place in an education system. The questions and answers are
				public and part of the source code for the application. It has
				no integrations with external scoring systems, etc. It is
				intended to support <em>personal learning.</em>
			</p>

			<h2>Colophon</h2>

			<p>
				This application is made with React, Typescript, Tanstack
				Router, and Zustand.
			</p>
		</div>
	)
}
