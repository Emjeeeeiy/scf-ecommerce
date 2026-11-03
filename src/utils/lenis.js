import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let lenis = null

// Weighted buttery smooth scrolling: low lerp = slightly heavier feel with
// momentum, while staying responsive. Singleton so router + views share it.
export function initLenis() {
  if (lenis) return lenis
  // Respect the OS "reduce motion" setting: no smooth scrolling at all, the
  // browser scrolls natively (every caller already handles a null instance).
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  })
  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  return lenis
}

export function getLenis() {
  return lenis
}
