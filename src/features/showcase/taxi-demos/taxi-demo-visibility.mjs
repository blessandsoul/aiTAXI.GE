/**
 * Start one taxi timeline when its rendered card reaches the visibility threshold.
 * Reduced-motion and no-observer environments fall back to the player's immediate path.
 */
export function createTaxiDemoVisibilityGate({
  target,
  player,
  reducedMotion = false,
  Observer = globalThis.IntersectionObserver,
  threshold = 0.35,
}) {
  if (typeof player?.play !== 'function' || typeof player?.stop !== 'function') {
    throw new TypeError('createTaxiDemoVisibilityGate requires a timeline player');
  }

  let active = true;
  let hasPlayed = false;
  let observer = null;

  const playOnce = () => {
    if (!active || hasPlayed) return;
    hasPlayed = true;
    player.play();
  };

  if (reducedMotion || !target || typeof Observer !== 'function') {
    playOnce();
  } else {
    observer = new Observer(
      ([entry]) => {
        const meetsThreshold = (entry?.intersectionRatio ?? 0) >= threshold;
        if (!active || hasPlayed || !entry?.isIntersecting || !meetsThreshold) return;
        playOnce();
        observer?.disconnect();
        observer = null;
      },
      { threshold },
    );
    observer.observe(target);
  }

  return function cleanupTaxiDemoVisibilityGate() {
    if (!active) return;
    active = false;
    observer?.disconnect();
    observer = null;
    player.stop();
  };
}
