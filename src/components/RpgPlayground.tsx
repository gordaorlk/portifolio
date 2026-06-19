import { useState } from "react";
import { Terminal, Send, RotateCw, ShieldCheck } from "lucide-react";

interface Status {
  saude: number;
  xp: number;
  cafe: number;
  bugs: number;
}

export default function RpgPlayground() {
  const [history, setHistory] = useState<string[]>([
    "⚔️ BEM-VINDO À JORNADA DO DESENVOLVEDOR RPG! ⚔️",
    "Você inicia sua carreira como um Programador Júnior.",
    "Seu objetivo é sobreviver aos bugs, vencer reuniões de sprint e evoluir.",
    "--------------------------------------------------",
    "🚨 EVENTO LIMITADO: O temível erro 500 no ambiente de Produção na sexta-feira às 17h!",
    "Seu chefe pergunta quem quer fazer o Hotfix de emergência.",
    "O que você decide fazer?",
    "Escolha 1: Assumir a bronca sozinho (Custo mental alto, XP de Conhecimento altíssimo).",
    "Escolha 2: Fingir que a internet caiu e sair de fininho (Conserva saúde, mas perde moral).",
    "Escolha 3: Pedir socorro para o Programador Sênior (Equilibrado e seguro)."
  ]);

  const [status, setStatus] = useState<Status>({
    saude: 100,
    xp: 15,
    cafe: 3,
    bugs: 0
  });

  const [currentStep, setCurrentStep] = useState(1); // 1 = Error 500, 2 = Code Review, 3 = Final
  const [finished, setFinished] = useState(false);

  const handleChoice = (option: number) => {
    if (finished) return;

    if (currentStep === 1) {
      if (option === 1) {
        setStatus((s) => ({ ...s, saude: s.saude - 30, xp: s.xp + 50, bugs: s.bugs + 1 }));
        setHistory((h) => [
          ...h,
          "> [Escolha 1] Você escolheu assumir tudo sozinho!",
          "💡 Fantástico! Virou a noite corrigindo o código do Docker. Sua saúde mental caiu 30%, mas você aprendeu como gerenciar clusters de alto risco! (+50 XP)"
        ]);
      } else if (option === 2) {
        setStatus((s) => ({ ...s, saude: Math.min(s.saude + 10, 100), xp: s.xp - 5 }));
        setHistory((h) => [
          ...h,
          "> [Escolha 2] Você sumiu de fininho do Slack.",
          "🤫 Você dormiu tranquilo e assistiu série no final de semana, mas na segunda a cobrança veio pesada e o clima ficou tenso. (-5 XP)"
        ]);
      } else {
        setStatus((s) => ({ ...s, saude: s.saude - 10, xp: s.xp + 20 }));
        setHistory((h) => [
          ...h,
          "> [Escolha 3] Pediu ajuda ao profissional Sênior.",
          "🤝 Decisão madura. Trabalhando em par, vocês resolveram o bug em 1 hora. Evitou dores de cabeça e ganhou proximidade de mentoria. (+20 XP)"
        ]);
      }

      // Move to Step 2
      setTimeout(() => {
        setHistory((h) => [
          ...h,
          "--------------------------------------------------",
          "🚀 EVENTO 2: A temida Code Review Geral na sprint quinzenal!",
          "Seu código foi classificado com 'Dívida Técnica' pelo time técnico do cliente.",
          "Qual é sua ação estratégica?",
          "Escolha 1: Refatorar tudo em segredo de madrugada (Exige café, previne cobranças).",
          "Escolha 2: Defender em público que 'funciona na minha máquina' (Custo alto de relacionamento).",
          "Escolha 3: Marcar uma reunião sincera para absorver as críticas construtivas (Equilibrado)."
        ]);
        setCurrentStep(2);
      }, 800);

    } else if (currentStep === 2) {
      if (option === 1) {
        setStatus((s) => ({ ...s, saude: s.saude - 20, xp: s.xp + 40, cafe: s.cafe - 1 }));
        setHistory((h) => [
          ...h,
          "> [Escolha 1] Você codou de madrugada.",
          "☕ Consumiu bastante café. Refatorou os endpoints e o código ficou lindo, o arquiteto lhe elogiou muito! (+40 XP)"
        ]);
      } else if (option === 2) {
        setStatus((s) => ({ ...s, saude: s.saude - 40, xp: s.xp - 10 }));
        setHistory((h) => [
          ...h,
          "> [Escolha 2] Argumentou 'funciona na minha máquina'.",
          "😱 Que perigo! Colegas apontaram 5 loops recursivos que causavam lentidão. Desgaste mental e perda de moral técnica. (-10 XP)"
        ]);
      } else {
        setStatus((s) => ({ ...s, saude: s.saude + 5, xp: s.xp + 30 }));
        setHistory((h) => [
          ...h,
          "> [Escolha 3] Marcou sessão esclarecedora com o revisor.",
          "🌟 Excelente liderança técnica. Você ganhou carinho do time e o código passou de primeira no merge request. (+30 XP)"
        ]);
      }

      // Move to Final Summary
      setTimeout(() => {
        setFinished(true);
        setHistory((h) => [
          ...h,
          "--------------------------------------------------",
          "🏆 JORNADA FINALIZADA COM SUCESSO!",
          "Você encerrou a simulação do Hubert RPG."
        ]);
      }, 800);
    }
  };

  const restart = () => {
    setHistory([
      "⚔️ BEM-VINDO À JORNADA DO DESENVOLVEDOR RPG! ⚔️",
      "Você inicia sua carreira como um Programador Júnior.",
      "Seu objetivo é sobreviver aos bugs, vencer reuniões de sprint e evoluir.",
      "--------------------------------------------------",
      "🚨 EVENTO LIMITADO: O temível erro 500 no ambiente de Produção na sexta-feira às 17h!",
      "Seu chefe pergunta quem quer fazer o Hotfix de emergência.",
      "O que você decide fazer?",
      "Escolha 1: Assumir a bronca sozinho (Custo mental alto, XP de Conhecimento altíssimo).",
      "Escolha 2: Fingir que a internet caiu e sair de fininho (Conserva saúde, mas perde moral).",
      "Escolha 3: Pedir socorro para o Programador Sênior (Equilibrado e seguro)."
    ]);
    setStatus({
      saude: 100,
      xp: 15,
      cafe: 3,
      bugs: 0
    });
    setCurrentStep(1);
    setFinished(false);
  };

  return (
    <div className="p-4 bg-[#0a0518] border border-violet-950 rounded-xl" id="rpg-playground">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-violet-950 pb-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-violet-300 font-mono">
          <Terminal className="w-4 h-4 text-violet-400" />
          TERMINAL SHELL: rpg_textual.py
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={restart}
            className="text-[10px] bg-violet-900/30 hover:bg-violet-900/60 text-violet-300 px-2.5 py-1 rounded border border-violet-800/40 transition flex items-center gap-1 font-mono"
          >
            <RotateCw className="w-3 h-3" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Attributes Indicators */}
      <div className="grid grid-cols-4 gap-2 mb-4 bg-violet-950/20 p-2.5 rounded-lg border border-violet-900/10 font-mono text-center">
        <div>
          <div className="text-[10px] text-violet-400 font-semibold">SAÚDE MENTAL</div>
          <div className={`text-sm font-bold ${status.saude < 50 ? "text-rose-400" : "text-emerald-400"}`}>
            {status.saude}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-violet-400 font-semibold">CONHECIMENTO</div>
          <div className="text-sm font-bold text-amber-300">{status.xp} XP</div>
        </div>
        <div>
          <div className="text-[10px] text-violet-400 font-semibold">CAFÉ RESTANTE</div>
          <div className="text-sm font-bold text-yellow-400">{status.cafe} x</div>
        </div>
        <div>
          <div className="text-[10px] text-violet-400 font-semibold">HANK GERAL</div>
          <div className="text-sm font-bold text-sky-400">
            {status.xp > 80 ? "Sênior" : status.xp > 40 ? "Pleno" : "Júnior"}
          </div>
        </div>
      </div>

      {/* Terminal Line Console Output */}
      <div className="bg-neutral-950/90 rounded-lg p-3 h-52 overflow-y-auto mb-4 border border-violet-950/40 text-xs font-mono leading-relaxed space-y-1">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.startsWith(">")
                ? "text-yellow-400 font-semibold"
                : line.startsWith("💡") || line.startsWith("🤝") || line.startsWith("☕") || line.startsWith("🌟")
                ? "text-emerald-400"
                : line.startsWith("🚨") || line.startsWith("😱")
                ? "text-rose-400"
                : line.startsWith("----------------")
                ? "text-violet-900"
                : "text-neutral-300"
            }`}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Play Controls Options */}
      {!finished ? (
        <div className="space-y-2">
          <p className="text-[10px] text-violet-400 font-mono uppercase tracking-widest font-semibold">Escolha um comando de ação:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {[1, 2, 3].map((op) => (
              <button
                key={op}
                onClick={() => handleChoice(op)}
                className="flex-1 bg-violet-950/40 hover:bg-violet-900/60 border border-violet-800/30 text-white hover:text-amber-300 font-semibold text-xs py-2 px-3 rounded-lg text-left transition active:scale-[0.98] flex items-center justify-between"
              >
                <span>Ação {op}</span>
                <Send className="w-3 h-3 text-violet-400" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-violet-950/20 border border-violet-900/40 rounded-lg text-center">
          <p className="text-emerald-300 text-xs font-mono font-medium flex items-center justify-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" />
            CARREIRA PRESERVADA!
          </p>
          <p className="text-[10px] text-neutral-400 max-w-sm mx-auto">
            Você sobreviveu aos bugs técnicos e evoluiu sua maturidade profissional no Hubert Simulator.
          </p>
        </div>
      )}
    </div>
  );
}
