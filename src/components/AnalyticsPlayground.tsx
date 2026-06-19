import { useState } from "react";
import { LineChart, Percent, DollarSign, Users, ChevronRight, Sliders } from "lucide-react";

export default function AnalyticsPlayground() {
  const [conversionMultiplier, setConversionMultiplier] = useState(1.0);
  const baseImpressions = 1248903;
  const baseAdquiridos = 48220;
  const baseMRR = 385760;

  // Recalculates variables dynamically when recruiters play with sliders!
  const currentImpressions = Math.round(baseImpressions);
  const currentAdquiridos = Math.round(baseAdquiridos * conversionMultiplier);
  const currentMRR = Math.round(baseMRR * conversionMultiplier);
  const conversionRate = ((currentAdquiridos / currentImpressions) * 100).toFixed(2);

  // Conversion Funnel Segment points
  const funnelSteps = [
    { name: "1. Impressões de Vitrine", value: currentImpressions, pct: "100%", color: "bg-sky-500" },
    { name: "2. Cadastro & Checkout Iniciado", value: Math.round(currentImpressions * 0.116 * conversionMultiplier), pct: "11.6%", color: "bg-indigo-500" },
    { name: "3. Pagamentos de Clientes", value: currentAdquiridos, pct: conversionRate + "%", color: "bg-emerald-500" }
  ];

  return (
    <div className="p-4 bg-slate-950/20 border border-slate-900/40 rounded-xl" id="analytics-playground animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-950 pb-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono">
          <LineChart className="w-4 h-4 text-sky-400" />
          INTERACTIVE DATABASES FEED: dashboard_financeiro.sql
        </span>
        <span className="text-[10px] bg-sky-500/10 px-2 py-0.5 text-sky-300 border border-sky-400/20 rounded font-mono">
          Métricas Ativas em Tempo Real
        </span>
      </div>

      {/* Dynamic Controllers slider bar */}
      <div className="mb-4 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 font-medium">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          SIMULAR META DE CONVERSÃO TRIMESTRAL:
        </span>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={conversionMultiplier}
            onChange={(e) => setConversionMultiplier(parseFloat(e.target.value))}
            className="w-full sm:w-36 h-1 bg-slate-800 rounded accent-sky-400"
          />
          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-900/30">
            {Math.round(conversionMultiplier * 100)}%
          </span>
        </div>
      </div>

      {/* KPI Counters Deck Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/10 font-mono">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">Clientes Pagantes</span>
            <Users className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-base font-bold text-slate-100">{currentAdquiridos.toLocaleString()}</p>
          <span className="text-[9px] text-emerald-400">▲ +12% MoM faturado</span>
        </div>

        <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/10 font-mono">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">Receita Mensal (MRR)</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-slate-100">R$ {currentMRR.toLocaleString()}</p>
          <span className="text-[9px] text-slate-500">LTV médio: 15 meses</span>
        </div>

        <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/10 font-mono">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">Taxa de Conversão</span>
            <Percent className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-slate-100">{conversionRate}%</p>
          <span className="text-[9px] text-sky-400">Eficiência de checkout</span>
        </div>
      </div>

      {/* Funnel Display graphics */}
      <div>
        <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider mb-2.5">
          Gráfico de Funil do e-Commerce (Atração → Venda):
        </p>
        <div className="space-y-2">
          {funnelSteps.map((step, idx) => {
            // Relational width matching step flow values
            const widthPct = (step.value / currentImpressions) * 100;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 font-medium">{step.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100 font-bold">{step.value.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500">({step.pct})</span>
                  </div>
                </div>
                {/* Visual bar graph */}
                <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-900">
                  <div
                    style={{ width: `${Math.max(widthPct, 3)}%` }}
                    className={`h-full ${step.color} transition-all duration-500 ease-out`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-2 bg-sky-950/10 border border-sky-900/20 rounded-lg flex items-center justify-between">
        <p className="text-[9px] text-slate-400 font-mono">
          SQL Query compilada e sincronizada com banco via Dremio / Postgres
        </p>
        <span className="text-[9px] text-emerald-400 font-mono leading-none flex items-center gap-1 font-bold">
          <ChevronRight className="w-3 h-3" />
          ONLINE
        </span>
      </div>
    </div>
  );
}
