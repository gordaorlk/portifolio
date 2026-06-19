import { TemaConfig, TemasObject } from "../types";
import { Search, Filter, Code2, Layers, Mail, Laptop2, Terminal, Gamepad2, Smartphone, LineChart, Cpu } from "lucide-react";

interface SidebarProps {
  temas: TemasObject;
  selectedTemaKey: string;
  onSelectTema: (key: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}

export default function Sidebar({
  temas,
  selectedTemaKey,
  onSelectTema,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: SidebarProps) {

  // Map icons dynamically to themes
  const getThemeIcon = (name: string) => {
    switch (name) {
      case "JavaScript":
        return <Code2 className="w-4 h-4 text-amber-400" />;
      case "Python":
        return <Terminal className="w-4 h-4 text-sky-400" />;
      case "Games":
        return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      case "Mobile":
        return <Smartphone className="w-4 h-4 text-pink-400" />;
      case "Analise":
        return <LineChart className="w-4 h-4 text-white" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-full lg:w-80 bg-[#010e1a]/85 backdrop-blur-md border-r border-white/10 flex flex-col p-6 font-sans shrink-0" id="portfolio-sidebar-container">
      {/* Profile Header */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <h1 className="text-xs font-bold tracking-widest text-blue-400 uppercase font-display">
          Hubert Portfolio
        </h1>
        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-mono">
          v2.0 Premium
        </p>
      </div>

      {/* Navigation Themes Selectors - Equivalent to st.sidebar.radio */}
      <div className="mb-6">
        <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold mb-3">
          Navegar Projetos
        </span>
        <div className="space-y-2">
          {Object.entries(temas).map(([key, config]) => {
            const isSelected = key === selectedTemaKey;
            return (
              <button
                key={key}
                onClick={() => onSelectTema(key)}
                className={`w-full flex items-center justify-between text-left text-sm px-4 py-3 rounded-xl transition-all duration-200 relative group border ${
                  isSelected
                    ? "bg-white/10 border-white/25 text-white font-bold shadow-md"
                    : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-100 transition-opacity"}`}>
                    {getThemeIcon(key)}
                  </span>
                  <span className="font-display tracking-tight text-sm uppercase">{key}</span>
                </div>
                {/* Badge content */}
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  isSelected
                    ? "bg-neutral-950/65 text-white/80 border-white/10"
                    : "bg-black/20 text-white/30 border-white/5 group-hover:text-white/60 group-hover:border-white/10"
                }`}>
                  {config.pasta}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Search & Content Filter Sidebar Panel */}
      <div className="space-y-5 flex-1 pb-6">
        <div className="space-y-2.5">
          <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold">
            Busca Inteligente
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filtrar por nome ou código..."
              className="w-full text-xs bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-white/30 transition font-mono placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Categories Type Filter checkbox/buttons tabs */}
        <div className="space-y-2.5">
          <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-white/40" />
            Filtrar por Tipo
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "all", label: "📦 Todos", short: "todos" },
              { id: "codigo", label: "💻 Códigos", short: "code" },
              { id: "texto", label: "📄 Textos", short: "info" },
              { id: "link", label: "🚀 Links", short: "link" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => onTypeFilterChange(f.id)}
                className={`text-[10px] font-bold py-2 px-2 rounded-xl border text-center transition-all ${
                  typeFilter === f.id
                    ? "bg-white/10 text-white border-white/20 font-bold shadow-sm"
                    : "bg-white/5 text-white/40 border-transparent hover:text-white hover:bg-white/10 hover:border-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Status - Bold design widget */}
      <div className="p-5 border-t border-white/10 mb-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
        <div className="flex items-center justify-between text-[10px] uppercase text-white/40 mb-3 font-mono">
          <span>System Status</span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-400 h-full w-3/4"></div>
        </div>
      </div>

      {/* Footer Credentials */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-2 font-mono text-[10px] text-white/40">
        <a
          href="mailto:hubertadulto@gmail.com"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Mail className="w-3 h-3 text-white/40 shrink-0" />
          hubertadulto@gmail.com
        </a>
        <div className="flex items-center gap-1.5">
          <Laptop2 className="w-3 h-3 text-white/40 shrink-0" />
          <span>© 2026 Hubert Portfólio</span>
        </div>
        <div className="text-[9px] text-white/30 leading-normal bg-black/20 p-2.5 rounded border border-white/5">
          Gerido por React Dev Server Integrado.
        </div>
      </div>
    </aside>
  );
}
