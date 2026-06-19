import React, { useEffect, useRef, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

export default function ParticlePlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleColor, setParticleColor] = useState("#f7df1e");
  const [particleCount, setParticleCount] = useState(80);
  const mouseRef = useRef({ x: null as number | null, y: null as number | null, radius: 120 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: Particle[] = [];

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = 250;
      init();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1.5;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse interaction
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        if (mx !== null && my !== null) {
          const dx = mx - this.x;
          const dy = my - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.x -= directionX * force * 3;
            this.y -= directionY * force * 3;
          }
        }
      }

      draw() {
        ctx!.fillStyle = particleColor;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particlesArray = [];
      const count = Math.min(particleCount, 250);
      for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw lines between close particles
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.strokeStyle = particleColor + "1a"; // Extra low opacity link line
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Listen to container resize to prevent static offsets
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    handleResize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [particleColor, particleCount]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = null;
    mouseRef.current.y = null;
  };

  return (
    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl" id="particle-playground-container">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-neutral-800 pb-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300 font-mono">
          <Sparkles className="w-4 h-4 text-amber-400" />
          PREVIEW CANVASES: efeito_particulas.js
        </span>
        <div className="flex items-center gap-3">
          {/* Color selectors */}
          <div className="flex gap-1.5 items-center">
            {["#f7df1e", "#38bdf8", "#ec4899", "#10b981", "#a855f7"].map((c) => (
              <button
                key={c}
                onClick={() => setParticleColor(c)}
                style={{ backgroundColor: c }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  particleColor === c ? "scale-125 border-white" : "border-transparent opacity-60"
                }`}
                title="Alterar cor de renderização"
              />
            ))}
          </div>
          
          {/* Count controller */}
          <span className="text-[10px] text-neutral-400 font-mono">Qtde:</span>
          <input
            type="range"
            min="20"
            max="180"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-16 accent-amber-400 h-1 rounded"
          />
        </div>
      </div>

      <div ref={containerRef} className="relative w-full overflow-hidden bg-neutral-950 rounded-lg cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="block w-full h-[250px]"
        />
        <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-neutral-500 font-mono bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
          Mova o mouse para interagir • Partículas: {particleCount}
        </div>
      </div>
    </div>
  );
}
