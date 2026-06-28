"use client";

import React, { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

export default function ParticleBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motion = useStore((state) => state.motion);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || !ctx || motion === "reduced" || prefersReducedMotion) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedParticles = () => {
      particles.length = 0;
      const count = Math.min(58, Math.max(28, Math.floor(width / 32)));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          alpha: Math.random() * 0.35 + 0.08,
        });
      }
    };

    const handleResize = () => {
      setCanvasSize();
      seedParticles();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        ctx.fillStyle = `rgba(0, 243, 255, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.14 * (1 - distance / 180)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(render);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [motion]);

  return (
    <canvas
      ref={canvasRef}
      className="cognitive-decor pointer-events-none fixed inset-0 z-0 opacity-60 mix-blend-screen"
      aria-hidden="true"
    />
  );
}
