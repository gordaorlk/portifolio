import React, { useEffect, useState } from "react";
import { Projeto, TemasObject, TemaConfig } from "./types";
import Sidebar from "./components/Sidebar";
import ProjectItem from "./components/ProjectItem";
import { FolderGit, RefreshCw, Cpu, Layers, HelpCircle, Code } from "lucide-react";

const DEFAULT_TEMAS: TemasObject = {
  "JavaScript": {
    "bg": "linear-gradient(135deg, #0c0c0e 0%, #1e1e24 100%)",
    "header": "#f7df1e",
    "text_h": "#000000",
    "card": "rgba(247, 223, 30, 0.08)",
    "content_bg": "#ffffff",
    "content_text": "#f7df1e",
    "lang": "javascript",
    "pasta": "JS",
    "desc": "✨ Interatividade e Front-end moderno"
  },
  "Python": {
    "bg": "linear-gradient(135deg, #020c15 0%, #0d2136 100%)",
    "header": "linear-gradient(to right, #38bdf8, #facc15)",
    "text_h": "#0c2340",
    "card": "rgba(255, 255, 255, 0.04)",
    "content_bg": "#1e1e26",
    "content_text": "#ffffff",
    "lang": "python",
    "pasta": "PY",
    "desc": "🐍 Automação e Inteligência de Dados"
  },
  "Games": {
    "bg": "linear-gradient(135deg, #0c051a 0%, #2e0852 100%)",
    "header": "linear-gradient(to right, #22d3ee, #3b82f6)",
    "text_h": "#ffffff",
    "card": "rgba(34, 211, 238, 0.06)",
    "content_bg": "#0a0a0a",
    "content_text": "#22d3ee",
    "lang": "python",
    "pasta": "GAMES",
    "desc": "🎮 Experiências Imersivas e Jogos"
  },
  "Mobile": {
    "bg": "linear-gradient(135deg, #0d0112 0%, #2b0436 100%)",
    "header": "#ec4899",
    "text_h": "#ffffff",
    "card": "rgba(236, 72, 153, 0.08)",
    "content_bg": "#ffffff",
    "content_text": "#ffffff",
    "lang": "markdown",
    "pasta": "QRcode",
    "desc": "📱 Soluções Mobile e QR Codes"
  },
  "Analise": {
    "bg": "linear-gradient(135deg, #01041b 0%, #032b54 100%)",
    "header": "#ffffff",
    "text_h": "#01041b",
    "card": "rgba(255, 255, 255, 0.08)",
    "content_bg": "rgba(255, 255, 255, 0.04)",
    "content_text": "#ffffff",
    "lang": "markdown",
    "pasta": "AP",
    "desc": "📊 Transformando dados em decisões"
  }
};

export default function App() {
  const [temas, setTemas] = useState<TemasObject>(DEFAULT_TEMAS);
  const [selectedTemaKey, setSelectedTemaKey] = useState<string>("JavaScript");
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Search and content filtering query state parameters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all"); // "all" | "codigo" | "texto" | "link"

  const selectedTema = temas[selectedTemaKey] || DEFAULT_TEMAS["JavaScript"];

  // Fetch customizable project list from live express API
  const fetchProjects = async (pasta: string) => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const response = await fetch(`/api/projects?folder=${pasta}`);
      if (!response.ok) {
        throw new Error("Erro de rede ao carregar projetos");
      }
      const data = await response.json();
      setProjetos(data);
    } catch (e: any) {
      console.error("Falha ao puxar projetos:", e);
      setErrorStatus("Ambiente temporariamente offline. Carregando dados offline resilientes...");
      
      // Standalone sandbox state resilience fallback in case local API endpoint boot experiences a momentary stagger!
      // Seeds the portfolio with high quality simulated entries matching folder expectations
      setProjetos(getOfflineResilientProjects(pasta));
    } finally {
      setLoading(false);
    }
  };

  // Fetch custom configured server themes
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch("/api/themes");
        if (response.ok) {
          const data = await response.json();
          setTemas(data);
        }
      } catch (err) {
        console.warn("Usando pre-seed local resiliente de temas.");
      }
    };
    fetchThemes();
  }, []);

  // Sync projects list of active theme key
  useEffect(() => {
    fetchProjects(selectedTema.pasta);
  }, [selectedTemaKey, temas]);

  // Real-time filtering engine logic (matches names, path keywords, and inner file content strings!)
  const filteredProjetos = projetos.filter((proj) => {
    const q = searchQuery.toLowerCase();
    
    // Keyword searches
    const matchesKeyword =
      proj.nome.toLowerCase().includes(q) ||
      proj.conteudo.toLowerCase().includes(q) ||
      proj.ext.toLowerCase().includes(q);

    // Filter Type searches
    const matchesType = typeFilter === "all" ? true : proj.tipo === typeFilter;

    return matchesKeyword && matchesType;
  });

  return (
    <div
      className="min-h-screen text-neutral-100 flex flex-col lg:flex-row transition-all duration-500 ease-out font-sans overflow-x-hidden select-text SelectionColors relative"
      style={{
        background: `radial-gradient(circle at top right, ${selectedTema.header.includes("linear") ? "rgba(96, 165, 250, 0.12)" : selectedTema.header + "15"}, transparent 50%), radial-gradient(circle at bottom left, #010c17 0%, #021d33 100%)`,
      }}
      id="main-app"
    >
      <style>{`
        .SelectionColors::selection {
          background-color: ${selectedTema.header.includes("linear") ? "#38bdf8" : selectedTema.header};
          color: #000;
        }
      `}</style>

      {/* Control panel & options configuration Sidebar drawer layout */}
      <Sidebar
        temas={temas}
        selectedTemaKey={selectedTemaKey}
        onSelectTema={setSelectedTemaKey}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Absolute watermark background from Design HTML */}
      <div className="absolute top-0 right-0 p-12 sm:p-24 opacity-5 pointer-events-none select-none z-0">
        <h2 className="text-[120px] sm:text-[180px] lg:text-[240px] font-black leading-none uppercase tracking-tighter text-blue-400 font-display">
          {selectedTema.pasta}
        </h2>
      </div>

      {/* Main Viewport panel */}
      <main className="flex-1 flex flex-col p-6 sm:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto relative z-10">
        
        {/* Viewport Header - Majestic Bold Typography */}
        <header className="flex flex-col justify-end min-h-[140px] relative z-10 font-display">
          <div className="flex items-center space-x-2 text-blue-400 mb-2 uppercase tracking-widest font-black text-[11px] sm:text-xs">
            <span>/</span><span>HOME</span><span>/</span><span>{selectedTema.pasta}</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none uppercase tracking-tighter text-white">
            {selectedTemaKey} Core
          </h1>
          <p className="text-base sm:text-lg text-white/60 mt-4 max-w-2xl font-light italic leading-relaxed">
            {selectedTema.desc}
          </p>
        </header>

        {/* 12-column responsive layout grid from the Design HTML */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 flex-1 items-start">
          
          {/* Side stats and metadata panel (Col span 4) */}
          <div className="col-span-1 lg:col-span-4 space-y-4">
            
            {/* Total activities stats box */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div className="text-xs text-white/40 uppercase font-semibold tracking-wider">Total Projects</div>
              <div className="text-4xl font-bold text-blue-400 font-display">{projetos.length}</div>
            </div>

            {/* Active Directory stats box */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div className="text-xs text-white/40 uppercase font-semibold tracking-wider">Active Directory</div>
              <div className="text-sm font-mono text-white/80 tracking-tighter">/root/{selectedTema.pasta}</div>
            </div>

            {/* Recent Uploads itemized directory list */}
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xs uppercase font-black text-blue-400 mb-4 tracking-widest font-display">Recent Outputs</h3>
              <ul className="space-y-3.5 text-xs font-medium">
                {projetos.slice(0, 3).map((proj, idx) => (
                  <li key={proj.nome} className={`flex items-center justify-between border-b border-white/5 pb-2.5 ${idx > 0 ? "opacity-60" : ""}`}>
                    <span className="font-mono text-white/80 uppercase truncate max-w-[150px]" title={proj.nome}>
                      {proj.nome}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono font-bold uppercase shrink-0">
                      {proj.tipo}
                    </span>
                  </li>
                ))}
                {projetos.length === 0 && (
                  <li className="text-white/40 text-xs italic">Nenhum projeto indexado</li>
                )}
              </ul>
            </div>
          </div>

          {/* Core Projects Accordion List (Col span 8) */}
          <div className="col-span-1 lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between gap-3 text-xs font-mono text-white/40 border-b border-white/10 pb-3 font-semibold">
              <span className="flex items-center gap-2">
                <FolderGit className="w-4 h-4 text-white/30 animate-pulse" />
                <span>{filteredProjetos.length} de {projetos.length} Atividades encontradas</span>
              </span>
              <button
                onClick={() => fetchProjects(selectedTema.pasta)}
                className="flex items-center gap-1.5 hover:text-white transition-colors shrink-0 uppercase tracking-widest font-bold text-[10px]"
                title="Sincronizar arquivos locais"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sincronizar
              </button>
            </div>

            {/* Sandbox active fallback warning banner */}
            {errorStatus && (
              <div className="p-3.5 bg-amber-950/25 border border-amber-500/20 text-amber-200 rounded-2xl text-xs font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 shrink-0 animate-pulse text-amber-400" />
                <span>{errorStatus}</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <RefreshCw className="w-8 h-8 text-white/20 animate-spin" />
                <span className="text-xs font-mono text-white/40">Buscando repositórios locais...</span>
              </div>
            ) : filteredProjetos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-3">
                <HelpCircle className="w-10 h-10 text-white/20" />
                <p className="text-xs text-white/50 max-w-sm leading-relaxed">
                  Nenhum arquivo ou código encontrado com filtros atuais! Experimente alterar o termo digitado ou mude a chave de categoria na barra lateral.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjetos.map((proj) => (
                  <ProjectItem key={proj.nome} projeto={proj} tema={selectedTema} />
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

// Standalone offline data resilience module in case server endpoints is starting
function getOfflineResilientProjects(folder: string): Projeto[] {
  const list: { [key: string]: Projeto[] } = {
    JS: [
      {
        nome: "carrossel_interativo.js",
        caminho_relativo: "JS/carrossel_interativo.js",
        tipo: "codigo",
        ext: "js",
        conteudo: `class PremiumCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.slides = Array.from(this.container.querySelectorAll('.slide'));
    this.currentIndex = 0;
    this.interval = options.interval || 3000;
  }
}`
      },
      {
        nome: "efeito_particulas.js",
        caminho_relativo: "JS/efeito_particulas.js",
        tipo: "codigo",
        ext: "js",
        conteudo: `// Canvas HTML5 Particles logic simulator script
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];`
      }
    ],
    PY: [
      {
        nome: "analise_vendas.py",
        caminho_relativo: "PY/analise_vendas.py",
        tipo: "codigo",
        ext: "py",
        conteudo: `import pandas as pd
import numpy as np

def calcular_kpis_principais(df):
    total_receita = df['Faturamento_Bruto'].sum()
    print(f"✅ Receita Total: R$ {total_receita:,.2f}")`
      },
      {
        nome: "web_scraper.py",
        caminho_relativo: "PY/web_scraper.py",
        tipo: "codigo",
        ext: "py",
        conteudo: `import requests
from bs4 import BeautifulSoup

def buscar_cotacoes():
    url = "https://www.cambio-hoje.com.br"`
      }
    ],
    GAMES: [
      {
        nome: "snake_game.py",
        caminho_relativo: "GAMES/snake_game.py",
        tipo: "codigo",
        ext: "py",
        conteudo: `import pygame
import random

# Jogo clássico Snake de arcade`
      },
      {
        nome: "rpg_textual.py",
        caminho_relativo: "GAMES/rpg_textual.py",
        tipo: "codigo",
        ext: "py",
        conteudo: `def aventura():
    print("⚔️ BEM-VINDO À JORNADA DO DESENVOLVEDOR RPG! ⚔️")`
      }
    ],
    QRcode: [
      {
        nome: "mobile_app_links.txt",
        caminho_relativo: "QRcode/mobile_app_links.txt",
        tipo: "link",
        ext: "txt",
        conteudo: `https://github.com/joséadulto`
      },
      {
        nome: "qr_generator.js",
        caminho_relativo: "QRcode/qr_generator.js",
        tipo: "codigo",
        ext: "js",
        conteudo: `const qrCode = require('qrcode');
const { createCanvas } = require('canvas');`
      }
    ],
    AP: [
      {
        nome: "dashboard_financeiro.sql",
        caminho_relativo: "AP/dashboard_financeiro.sql",
        tipo: "codigo",
        ext: "sql",
        conteudo: `SELECT 
  COALESCE(m.mes, c.mes) AS mes_referencia,
  COALESCE(m.mrr_novo, 0) AS mrr_adquirido
FROM mrr_agrupado;`
      },
      {
        nome: "relatorio_insights.txt",
        caminho_relativo: "AP/relatorio_insights.txt",
        tipo: "texto",
        ext: "txt",
        conteudo: `# META DE KPI - SEGUNDO TRIMESTRE - josé ANALÍSTICA
Funil de Vendas Recorrentes (e-Commerce)
• Impressões de Vitrine: 1,248,903 (+12% MoM)`
      }
    ]
  };
  return list[folder] || [];
}
