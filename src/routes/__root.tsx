import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
	component: () => (
		<>
			<header>
				<h1>Scale Quiz</h1>
			</header>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
})
