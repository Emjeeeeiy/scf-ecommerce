export function runThemeTransition(event, applyChange) {
  const supportsViewTransition = typeof document !== 'undefined' && typeof document.startViewTransition === 'function'
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!supportsViewTransition || prefersReducedMotion || !event) {
    applyChange()
    return Promise.resolve()
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const transition = document.startViewTransition(() => {
    applyChange()
  })

  return transition.ready.then(() => {
    const animation = document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 550,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
    )
    return animation.finished
  })
}
