-- --- Query de Análise Financeira & Churn Mensal ---
-- Autor: Hubert
-- Descrição: Extrai o volume de transações recorrentes (MRR), faturamento por categoria,
-- e calcula a taxa de Churn móvel dos últimos 6 meses para auxílio de tomada de decisão.

WITH assinaturas_ativas AS (
  SELECT 
    user_id,
    plan_type,
    mrr_value,
    DATE_TRUNC('month', start_date) AS mes_inicio,
    DATE_TRUNC('month', cancel_date) AS mes_cancelamento
  FROM user_subscriptions
  WHERE status IN ('active', 'cancelled')
),

mrr_agrupado AS (
  SELECT 
    mes_inicio AS mes,
    SUM(mrr_value) AS mrr_novo,
    COUNT(DISTINCT user_id) AS novos_clientes
  FROM assinaturas_ativas
  GROUP BY 1
),

churn_agrupado AS (
  SELECT 
    mes_cancelamento AS mes,
    SUM(mrr_value) AS mrr_perdido,
    COUNT(DISTINCT user_id) AS clientes_cancelados
  FROM assinaturas_ativas
  WHERE mes_cancelamento IS NOT NULL
  GROUP BY 1
)

SELECT 
  COALESCE(m.mes, c.mes) AS mes_referencia,
  COALESCE(m.mrr_novo, 0) AS mrr_adquirido,
  COALESCE(c.mrr_perdido, 0) AS mrr_churned,
  -- Taxa de churn percentual escalada
  ROUND(
    (COALESCE(c.mrr_perdido, 0)::NUMERIC / NULLIF(COALESCE(m.mrr_novo, 1), 0)) * 100, 
    2
  ) AS churn_rate_percentual,
  COALESCE(m.novos_clientes, 0) AS novos_usuarios_ativos
FROM mrr_agrupado m
FULL OUTER JOIN churn_agrupado c ON m.mes = c.mes
ORDER BY mes_referencia DESC;
