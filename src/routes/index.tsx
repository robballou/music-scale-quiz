import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: Index,
})

function Index() {
	return (
		<section>
			<div className="button">
				<Link to="/quiz" className="link--button">
					Start a new quiz!
				</Link>
			</div>
		</section>
	)
}
