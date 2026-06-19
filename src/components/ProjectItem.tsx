import React, { useState } from "react";
import { Projeto, TemaConfig } from "../types";
import { ChevronDown, ChevronUp, Copy, Check, ExternalLink, Terminal, Code, Settings, PanelLeftClose } from "lucide-react";

// Playgrounds lazy elements
import ParticlePlayground from "./ParticlePlayground";
import SnakeGamePlayground from "./SnakeGamePlayground";
import RpgPlayground from "./RpgPlayground";
import QrPlayground from "./QrPlayground";
import AnalyticsPlayground from "./AnalyticsPlayground";

interface ProjectItemProps {
  key?: React.Key;
  projeto: Projeto;
  tema: TemaConfig;
}

export default function ProjectItem({ projeto, tema }: ProjectItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleCopyCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(projeto.conteudo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determines if an interactive simulation / playground exists for this file
  const renderPlayground = () => {
    const fn = projeto.nome.toLowerCase();
    
    if (fn.includes("particulas")) {
      return <ParticlePlayground />;
    }
    if (fn.includes("snake")) {
      return <SnakeGamePlayground />;
    }
    if (fn.includes("rpg")) {
      return <RpgPlayground />;
    }
    if (fn.includes("qr_generator")) {
      return <QrPlayground />;
    }
    if (fn.includes("insights") || fn.includes("financeiro") || fn.includes("vendas")) {
      return <AnalyticsPlayground />;
    }
    return null;
  };

  // Convert header background / border color properties safely
  const headColor = tema.header.includes("linear") ? "bg-cyan-500" : tema.header;
  const textColor = tema.text_h;

  return (
    <div
      className="mb-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        boxShadow: isOpen ? "0 10px 30px -10px rgba(0,0,0,0.5)" : "none",
      }}
      id={`project-card-${projeto.nome.replace(/\s+/g, "-")}`}
    >
      {/* Expander Header Accordion Title */}
      <div
        onClick={toggleOpen}
        style={{
          background: isOpenedHeaderBg(isOpen, tema),
          color: isOpen ? textColor : "#ffffff",
        }}
        className="flex items-center justify-between p-4 cursor-pointer hover:opacity-95 transition-all select-none"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs shrink-0 font-mono p-1 bg-neutral-900/40 rounded border border-neutral-800/10 uppercase font-semibold">
            {projeto.ext}
          </span>
          <h3 className="text-xs sm:text-sm font-display font-medium uppercase tracking-wider">
            ✨ {projeto.nome.replace(/_/g, " ").replace(/\.[^/.]+$/, "")}
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          {projeto.tipo === "codigo" && (
            <button
              onClick={handleCopyCode}
              title="Copiar código fonte"
              className="p-1 px-2 rounded bg-neutral-950/20 hover:bg-neutral-950/40 text-[10px] uppercase font-mono tracking-widest transition flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
        </div>
      </div>

      {/* Accordion expander content */}
      {isOpen && (
        <div className="p-4 sm:p-5 text-neutral-300 font-sans space-y-4 rounded-b-2xl">
          {/* Active play widgets inside expander */}
          {renderPlayground()}

          {/* Classification: Imagem */}
          {projeto.tipo === "imagem" && (
            <div className="flex flex-col items-center justify-center p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <img
                src={`/api/file?path=${projeto.caminho_relativo}`}
                alt={projeto.nome}
                className="max-h-[300px] object-contain rounded-lg shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] text-neutral-500 font-mono mt-2 uppercase tracking-wide">
                Exibição de Atividade: {projeto.nome}
              </span>
            </div>
          )}

          {/* Classification: Link (Streamlit button) */}
          {projeto.tipo === "link" && (
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3 font-sans">
              <p className="text-xs text-neutral-400">
                O projeto <strong className="text-neutral-100">{projeto.nome.replace(/_/g, " ")}</strong> está publicado externamente:
              </p>
              <a
                href={projeto.conteudo.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium text-xs px-6 py-2.5 rounded-xl transition w-full text-center tracking-normal shadow-lg shadow-pink-900/10 active:scale-95"
              >
                🚀 ACESSAR PROJETO EXTERNO
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Classification: Codigo Container Editor */}
          {projeto.tipo === "codigo" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 font-bold tracking-wider">
                <span>CÓDIGO DE ATIVIDADE ({projeto.ext.toUpperCase()})</span>
                <span>HUBERT MASTER COMPILER</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950">
                {/* Code syntax window title container */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900 bg-neutral-950/40 font-mono text-[10px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="ml-1 text-[10px]">{projeto.caminho_relativo}</span>
                  </div>
                  <span>UTF-8</span>
                </div>
                {/* Code viewport block container */}
                <pre className="p-4 overflow-x-auto text-[11px] sm:text-xs font-mono text-neutral-200 leading-relaxed scrollbar-thin scrollbar-thumb-neutral-850">
                  <code>{projeto.conteudo}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Classification: Texto / Fallback markup */}
          {projeto.tipo === "texto" && (
            <div className="border-l-2 border-neutral-700 pl-4 py-1 italic text-xs leading-relaxed text-neutral-400 bg-neutral-900/20 rounded-r-lg pr-3">
              {projeto.conteudo}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper colors mapper
function isOpenedHeaderBg(opened: boolean, t: TemaConfig): string {
  if (opened) {
    return t.header.includes("linear") ? "linear-gradient(to right, #38bdf8, #a855f7)" : t.header;
  }
  return "transparent";
}
