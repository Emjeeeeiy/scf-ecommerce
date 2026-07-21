export function runThemeTransition(event, applyChange) {
  const supportsViewTransition = typeof document !== 'undefined' && typeof document.startViewTransition === 'function'
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!supportsViewTransition || prefersReducedMotion || !event) {
    applyChange()
    return Promise.resolve()
  }

  // Matches the app's own md breakpoint used to split mobile/desktop layout.
  const isMobileViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

  const transition = document.startViewTransition(() => {
    applyChange()
  })

  if (isMobileViewport) {
    // Real phones resize window.innerWidth/innerHeight mid-interaction as the
    // address bar collapses (something desktop devtools mobile emulation never
    // does), which throws off a click-position circle wipe. clip-path is also
    // expensive to composite on weaker mobile GPUs. A plain opacity fade has no
    // position/size dependency and stays smooth and reliable on real devices.
    return transition.ready
      .then(() => {
        const animation = document.documentElement.animate(
          { opacity: [0, 1] },
          {
            duration: 280,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)'
          }
        )
        return animation.finished
      })
      .catch(() => {})
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  return transition.ready
    .then(() => {
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
    .catch(() => {})
}
