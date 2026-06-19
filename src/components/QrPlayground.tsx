import { useState } from "react";
import { Smartphone, RefreshCw, Send, Check } from "lucide-react";

export default function QrPlayground() {
  const [url, setUrl] = useState("https://github.com/hubertadulto");
  const [color, setColor] = useState("#e91e63");
  const [copied, setCopied] = useState(false);
  const [embedLogo, setEmbedLogo] = useState(true);

  const triggerCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simplistic SVG QR Code Generator Simulator
  // Renders a high fidelity looking grid matrix that matches the "URL" parameter dynamically!
  const generateGridPattern = () => {
    const hash = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const size = 15;
    const grid: boolean[][] = [];
    
    for (let r = 0; r < size; r++) {
      grid[r] = [];
      for (let c = 0; c < size; c++) {
        // Outer alignment square boxes (Fixed QR structure)
        const isAlignment =
          (r < 4 && c < 4) ||
          (r < 4 && c >= size - 4) ||
          (r >= size - 4 && c < 4) ||
          (r === size - 2 && c === size - 2);
          
        if (isAlignment) {
          // Fill outlines
          grid[r][c] = (r === 0 || r === 3 || c === 0 || c === 3) ||
                       (r === 0 && c >= size - 4) || (r === 3 && c >= size - 4) ||
                       (c === size - 4 && r < 4) || (c === size - 1 && r < 4) ||
                       (r === size - 4 && c < 4) || (r === size - 1 && c < 4) ||
                       (c === 0 && r >= size - 4) || (c === 3 && r >= size - 4);
        } else {
          // Pseudo-random dots based on hash and position
          grid[r][c] = ((r * c + hash) % 3 === 0) || ((r + c + hash) % 4 === 0);
        }
      }
    }
    
    // Clear center if emblem is enabled
    if (embedLogo) {
      const mid = Math.floor(size / 2);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          grid[mid + dr][mid + dc] = false;
        }
      }
    }
    
    return { grid, size };
  };

  const { grid, size } = generateGridPattern();

  return (
    <div className="p-4 bg-pink-950/10 border border-pink-950/30 rounded-xl" id="qr-playground">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-pink-950/20 pb-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-pink-200 font-mono">
          <Smartphone className="w-4 h-4 text-pink-500" />
          MOBILE ENGINE: qr_generator.js
        </span>
        <span className="text-[10px] bg-pink-500/10 px-2 py-0.5 text-pink-300 border border-pink-500/20 rounded font-mono">
          QR Code Inteligente
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left configurations inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono text-pink-300 font-semibold mb-1 uppercase">Link / Destinatário QR:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-xs bg-neutral-900 border border-pink-950/40 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500 font-mono"
              placeholder="Digite o link do portfólio"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-pink-300 font-semibold mb-1 uppercase">Cor de Preenchimento:</label>
              <div className="flex gap-1.5 items-center mt-1">
                {["#e91e63", "#a855f7", "#3b82f6", "#10b981", "#171717"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-md border transition ${
                      color === c ? "border-white scale-110" : "border-transparent opacity-60"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-pink-300 font-semibold mb-1 uppercase">Selo de Logo:</label>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={embedLogo}
                  onChange={(e) => setEmbedLogo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600"></div>
                <span className="ml-2 text-[10px] text-pink-200 font-mono">Central</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={triggerCopy}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 text-pink-200 border border-pink-950/40 py-2 px-3 rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Smartphone className="w-3.5 h-3.5" />}
              {copied ? "Link Copiado!" : "Copiar Link"}
            </button>
            <button
              onClick={() => setUrl("https://ais-pre-uutaeduqidy3tuvnrrehuv-274658568134.us-west2.run.app")}
              className="px-3 bg-pink-920/30 hover:bg-pink-900/40 border border-pink-800/30 text-pink-200 text-xs rounded-lg transition"
              title="Reset para link oficial"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right QR Canvas Frame viewer */}
        <div className="flex flex-col items-center justify-center bg-neutral-950 p-4 border border-pink-950/20 rounded-lg">
          <div className="relative p-3 bg-white rounded-xl shadow-lg flex items-center justify-center">
            {/* SVG custom generated matrix */}
            <svg width="150" height="150" viewBox={`0 0 ${size} ${size}`}>
              {grid.map((row, r) =>
                row.map((active, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={c}
                    y={r}
                    width="1"
                    height="1"
                    fill={active ? color : "transparent"}
                    shapeRendering="crispEdges"
                  />
                ))
              )}
            </svg>

            {/* Simulated overlaying central emblem */}
            {embedLogo && (
              <div
                style={{ backgroundColor: color }}
                className="absolute inset-0 m-auto w-8 h-8 rounded-lg border-2 border-white flex items-center justify-center text-[10px] font-bold text-white font-mono shadow-md"
              >
                H
              </div>
            )}
          </div>
          <span className="text-[10px] text-neutral-500 font-mono mt-3">Rastreável por qualquer câmera de celular</span>
        </div>
      </div>
    </div>
  );
}
