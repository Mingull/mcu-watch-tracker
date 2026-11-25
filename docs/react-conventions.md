# React Conventions

- Use functional components and keep each component focused on one clear responsibility.
- Keep state as close as possible to where it is used. Lift state only when multiple components genuinely need to coordinate through it.
- Avoid effects for values that can be derived during render. Use memoization only when it prevents measured work or stabilizes a meaningful dependency.
- Name event handlers with a `handle` prefix and callback props with an `on` prefix.
- Keep forms keyboard accessible, associate every control with a label, and announce validation or server errors.
- Present loading, error, empty, pending, and successful states where they apply.
- Extract a component or hook when doing so clarifies ownership or enables genuine reuse, not solely to reduce line count.
- Preserve focus intentionally when opening and closing modal interfaces.
- Prefer composition over complex components with many conditional branches.
- Avoid prop drilling when state genuinely belongs to a shared feature or application context.
- Keep data fetching and external service communication separate from presentation where practical.
- Avoid unnecessary client-side state when values can be derived from existing state.
- Clean up subscriptions and event listeners when their owning components unmount.
