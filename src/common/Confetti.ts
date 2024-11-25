export const confetti = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const confettiCount = 300;
  const gravity = 0.1;
  const terminalVelocity = 5;
  const drag = 0.02;
  const colors = ['#fde132', '#009bde', '#ff6b00', '#ff00ff', '#00ff00', '#00ffff'];

  let animationFrameId: number;
  let isRunning = true;

  const confetti = Array.from({ length: confettiCount }, () => {
    const size = Math.random() * 8 + 2;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: size,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
      velocityX: Math.random() * 2 - 1,
      velocityY: Math.random() * 2 + size / 1.5,
      opacity: Math.random() * 0.5 + 0.5,
      shape: Math.random() > 0.5 ? 'circle' : 'rectangle',
    };
  });

  confetti.sort((a, b) => b.size - a.size);

  const drawConfetti = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((particle) => {
      if (!isRunning && particle.y > canvas.height) {
        return;
      }

      particle.velocityY += gravity * (particle.size / 10);
      particle.velocityY *= 1 - drag;
      particle.velocityY = Math.min(particle.velocityY, terminalVelocity + particle.size / 10);

      particle.y += particle.velocityY;
      particle.x += particle.velocityX;

      particle.rotation += particle.rotationSpeed;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;

      switch (particle.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rectangle':
        default:
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          break;
      }

      ctx.restore();
    });

    if (isRunning || confetti.some((p) => p.y < canvas.height)) {
      animationFrameId = requestAnimationFrame(drawConfetti);
    }
  };

  drawConfetti();

  setTimeout(() => {
    isRunning = false;
  }, 3000);

  setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
};
