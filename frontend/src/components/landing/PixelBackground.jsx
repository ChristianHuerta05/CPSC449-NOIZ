import React, { useRef, useEffect } from "react";

const PixelBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    let numParticles = Math.floor(canvas.width * canvas.height * 1);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 1;
        this.density = Math.random() * 10 + 1;
      }
      update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = mouse.radius;

        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * 3;
          const directionY = forceDirectionY * force * this.density * 3;
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 100;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 100;
          }

          this.x += (Math.random() - 0.5) * 0.2;
          this.y += (Math.random() - 0.5) * 0.2;
        }
      }
      draw(ctx) {
        const weight =
          (this.x / canvas.width + (canvas.height - this.y) / canvas.height) /
          2;
        const r = Math.round(255 * (1 - weight));
        const g = Math.round(123 * weight);
        const b = Math.round(127 * (1 - weight) + 255 * weight);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesRef.current = [];
      numParticles = Math.floor((canvas.width * canvas.height) / 200);
      for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push(new Particle(x, y));
      }
    };

    initParticles();

    const mouse = {
      x: canvas.width * 2,
      y: canvas.height * 2,
      radius: 50,
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((particle) => {
        particle.update(mouse);
        particle.draw(ctx);
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default PixelBackground;
