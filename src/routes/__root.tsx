import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
	component: () => (
		<>
			<header>
				<h1>
					<Link to="/">Scale Quiz</Link>
				</h1>
			</header>
			<hr />
			<Outlet />
			<footer>
				Created in 2025 by{' '}
				<a href="https://robballou.com" rel="me">
					Rob Ballou
				</a>
				. <Link to="/about">About</Link>
			</footer>
			<TanStackRouterDevtools />
		</>
	),
})
