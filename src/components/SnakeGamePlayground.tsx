import { useEffect, useRef, useState, useCallback } from "react";
import { Gamepad2, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

type Direcao = "CIMA" | "BAIXO" | "ESQUERDA" | "DIREITA";
type Ponto = [number, number];

export default function SnakeGamePlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const direcaoRef = useRef<Direcao>("DIREITA");
  const cobraRef = useRef<Ponto[]>([[6, 8], [5, 8], [4, 8]]);
  const comidaRef = useRef<Ponto>([12, 8]);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const LARGURA_GRID = 24;
  const ALTURA_GRID = 16;
  const TAM_BLOCO = 15;

  const resetGame = useCallback(() => {
    cobraRef.current = [[6, 8], [5, 8], [4, 8]];
    direcaoRef.current = "DIREITA";
    setScore(0);
    setGameOver(false);
    gerarComida();
  }, []);

  const gerarComida = () => {
    let novaX = Math.floor(Math.random() * LARGURA_GRID);
    let novaY = Math.floor(Math.random() * ALTURA_GRID);
    
    // Evita comida sob a cobra
    while (cobraRef.current.some(([x, y]) => x === novaX && y === novaY)) {
      novaX = Math.floor(Math.random() * LARGURA_GRID);
      novaY = Math.floor(Math.random() * ALTURA_GRID);
    }
    
    comidaRef.current = [novaX, novaY];
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset black velvet canvas matching background
    ctx.fillStyle = "#0c0316";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines (Muted Neon Purple)
    ctx.strokeStyle = "rgba(139, 92, 246, 0.05)";
    for (let i = 0; i < LARGURA_GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TAM_BLOCO, 0);
      ctx.lineTo(i * TAM_BLOCO, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < ALTURA_GRID; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * TAM_BLOCO);
      ctx.lineTo(canvas.width, j * TAM_BLOCO);
      ctx.stroke();
    }

    // Draw Food (Neon Coral Red)
    const [foodX, foodY] = comidaRef.current;
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(
      foodX * TAM_BLOCO + TAM_BLOCO / 2,
      foodY * TAM_BLOCO + TAM_BLOCO / 2,
      TAM_BLOCO / 2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Glow under food
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#f43f5e";
    ctx.beginPath();
    ctx.arc(
      foodX * TAM_BLOCO + TAM_BLOCO / 2,
      foodY * TAM_BLOCO + TAM_BLOCO / 2,
      TAM_BLOCO / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0; // reset glow

    // Draw Cobra (Neon Emerald Green)
    cobraRef.current.forEach(([cx, cy], index) => {
      ctx.fillStyle = index === 0 ? "#10b981" : "#34d399";
      ctx.fillRect(
        cx * TAM_BLOCO + 1,
        cy * TAM_BLOCO + 1,
        TAM_BLOCO - 2,
        TAM_BLOCO - 2
      );

      // Rounded eyes for cobra head
      if (index === 0) {
        ctx.fillStyle = "#000";
        ctx.fillRect(
          cx * TAM_BLOCO + (direcaoRef.current === "CIMA" || direcaoRef.current === "CIMA" ? 3 : 8),
          cy * TAM_BLOCO + (direcaoRef.current === "ESQUERDA" || direcaoRef.current === "DIREITA" ? 3 : 8),
          2,
          2
        );
      }
    });
  }, []);

  const moveSnake = useCallback(() => {
    const cabeca = cobraRef.current[0];
    let [nx, ny] = cabeca;

    switch (direcaoRef.current) {
      case "CIMA": ny -= 1; break;
      case "BAIXO": ny += 1; break;
      case "ESQUERDA": nx -= 1; break;
      case "DIREITA": nx += 1; break;
    }

    // Border Collision
    if (nx < 0 || nx >= LARGURA_GRID || ny < 0 || ny >= ALTURA_GRID) {
      triggerGameOver();
      return;
    }

    // Self Collision
    if (cobraRef.current.some(([cx, cy]) => cx === nx && cy === ny)) {
      triggerGameOver();
      return;
    }

    const novaCobra: Ponto[] = [[nx, ny], ...cobraRef.current];

    // Food Consumed logic
    const [fx, fy] = comidaRef.current;
    if (nx === fx && ny === fy) {
      setScore((s) => {
        const novo = s + 10;
        if (novo > highScore) setHighScore(novo);
        return novo;
      });
      gerarComida();
      // Simple synth audio beep if enabled
      if (soundEnabled && typeof window !== "undefined") {
        try {
          const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = actx.createOscillator();
          const vol = actx.createGain();
          osc.connect(vol);
          vol.connect(actx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(350, actx.currentTime);
          vol.gain.setValueAtTime(0.05, actx.currentTime);
          osc.start();
          vol.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.1);
          osc.stop(actx.currentTime + 0.12);
        } catch { /* AudioContext fallback */ }
      }
    } else {
      novaCobra.pop();
    }

    cobraRef.current = novaCobra;
    draw();
  }, [draw, highScore, soundEnabled]);

  const triggerGameOver = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    // Simple synth audio sad gameover chord
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = actx.createOscillator();
        const vol = actx.createGain();
        osc.connect(vol);
        vol.connect(actx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, actx.currentTime);
        vol.gain.setValueAtTime(0.06, actx.currentTime);
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(100, actx.currentTime + 0.3);
        vol.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.4);
        osc.stop(actx.currentTime + 0.4);
      } catch { /* fail safe */ }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      gameIntervalRef.current = setInterval(moveSnake, 130);
    } else {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    }

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isPlaying, moveSnake]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      const cur = direcaoRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (cur !== "BAIXO") direcaoRef.current = "CIMA";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (cur !== "CIMA") direcaoRef.current = "BAIXO";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (cur !== "DIREITA") direcaoRef.current = "ESQUERDA";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (cur !== "ESQUERDA") direcaoRef.current = "DIREITA";
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  // Initial Draw
  useEffect(() => {
    resetGame();
    draw();
  }, [resetGame, draw]);

  const startGame = () => {
    if (gameOver) {
      resetGame();
    }
    setIsPlaying(true);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  return (
    <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-xl" id="snake-playground">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-purple-950 pb-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-purple-200 font-mono">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          PLAYABLE CODE PREVIEW: snake_game.py
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-purple-400">SCORE:</span>
            <span className="text-emerald-400 font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-purple-400">HIGH:</span>
            <span className="text-amber-400 font-bold">{highScore}</span>
          </div>
          <button
            onClick={() => setSoundEnabled((v) => !v)}
            className="text-purple-400 hover:text-white transition"
            title="Toggle Sons"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          width={LARGURA_GRID * TAM_BLOCO}
          height={ALTURA_GRID * TAM_BLOCO}
          className="border border-purple-900/40 rounded-lg max-w-full"
        />

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-neutral-950/85 flex flex-col items-center justify-center p-4 text-center rounded-lg border border-purple-900/20">
            {gameOver ? (
              <>
                <p className="text-rose-500 font-display font-medium text-lg leading-normal tracking-wide mb-1 uppercase">GAME OVER</p>
                <p className="text-xs text-neutral-400 mb-4">Você colidiu a cobra e encerrou a simulação!</p>
              </>
            ) : (
              <>
                <p className="text-indigo-400 font-display font-medium text-sm leading-normal tracking-wide mb-1 uppercase">Simulador de Código Pygame</p>
                <p className="text-xs text-neutral-400 mb-4 max-w-xs leading-relaxed">
                  Interaja com os controles ou use as setas do teclado (W,A,S,D) para jogar.
                </p>
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="flex items-center gap-2 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                <Play className="w-3.5 h-3.5" />
                {gameOver ? "Jogar Novamente" : "Iniciar Canal"}
              </button>
              {gameOver && (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-3 py-2 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Button Controls for mobile viewports */}
      <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
        <button
          onClick={() => { if (direcaoRef.current !== "BAIXO") direcaoRef.current = "CIMA"; }}
          className="bg-neutral-800 px-3 py-1.5 text-xs text-white rounded active:scale-95"
        >
          ▲
        </button>
        <button
          onClick={() => { if (direcaoRef.current !== "DIREITA") direcaoRef.current = "ESQUERDA"; }}
          className="bg-neutral-800 px-3 py-1.5 text-xs text-white rounded active:scale-95"
        >
          ◀
        </button>
        <button
          onClick={() => { if (direcaoRef.current !== "CIMA") direcaoRef.current = "BAIXO"; }}
          className="bg-neutral-800 px-3 py-1.5 text-xs text-white rounded active:scale-95"
        >
          ▼
        </button>
        <button
          onClick={() => { if (direcaoRef.current !== "ESQUERDA") direcaoRef.current = "DIREITA"; }}
          className="bg-neutral-800 px-3 py-1.5 text-xs text-white rounded active:scale-95"
        >
          ▶
        </button>
      </div>

      <p className="text-[10px] text-center text-purple-400/60 font-mono mt-3">
        Dica: Use as setas do teclado do computador ou botões direcionais
      </p>
    </div>
  );
}
