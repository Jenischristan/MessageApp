import confetti from 'canvas-confetti';

export function fireReactionConfetti(emoji: string, originX = 0.5, originY = 0.5) {
  try {
    if (emoji === '🔥') {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { x: originX, y: originY },
        colors: ['#ff4d00', '#ff8800', '#ffdd00'],
        ticks: 120,
        gravity: 1.1,
        scalar: 0.85,
      });
    } else if (emoji === '❤️') {
      confetti({
        particleCount: 24,
        spread: 50,
        origin: { x: originX, y: originY },
        colors: ['#ff2a55', '#ff6b8b', '#ffccd5'],
        ticks: 110,
        gravity: 0.9,
        scalar: 0.9,
      });
    } else {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { x: originX, y: originY },
        colors: ['#0b69c7', '#38bdf8', '#ffffff'],
        ticks: 90,
        gravity: 1.2,
        scalar: 0.8,
      });
    }
  } catch {
    // Non-blocking fallback
  }
}
