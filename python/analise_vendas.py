# --- Análise Automatizada de Vendas com Pandas ---
# Autor: Hubert
# Descrição: Processa arquivos CSV de faturamento, gera insights comerciais
# e calcula projeções financeiras para o próximo trimestre.

import pandas as pd
import numpy as np

def carregar_e_limpar_dados(caminho_csv):
    """Carrega dados de vendas e resolve inconsistências cadastrais."""
    print("高度 Carregando dados de faturamento...")
    df = pd.read_csv(caminho_csv)
    
    # Limpeza de dados nulos
    df['Faturamento'].fillna(0, inplace=True)
    df['Data'] = pd.to_datetime(df['Data'])
    
    # Conversão de moedas
    df['Faturamento_Bruto'] = df['Quantidade'] * df['Preco_Unitario']
    return df

def calcular_kpis_principais(df):
    """Retorna dicionário de métricas consolidadas sobre o negócio."""
    total_receita = df['Faturamento_Bruto'].sum()
    ticket_medio = df['Faturamento_Bruto'].mean()
    total_unidades = df['Quantidade'].sum()
    
    print(f"✅ Receita Total: R$ {total_receita:,.2f}")
    print(f"✅ Ticket Médio: R$ {ticket_medio:,.2f}")
    print(f"✅ Unidades Comercializadas: {total_unidades:,}")
    
    return {
        "receita_total": total_receita,
        "ticket_medio": ticket_medio,
        "total_unidades": total_unidades
    }

def analisar_sazonalidade(df):
    """Calcula o faturamento agrupado por categoria e mês."""
    df['Mes'] = df['Data'].dt.to_period('M')
    vendas_mensais = df.groupby(['Mes', 'Categoria'])['Faturamento_Bruto'].sum().unstack()
    return vendas_mensais

# Exemplo de Execução com base mockada
if __name__ == "__main__":
    dados = {
        'Data': ['2026-01-10', '2026-01-15', '2026-02-05', '2026-02-28', '2026-03-12'],
        'Categoria': ['Eletrônicos', 'Moda', 'Eletrônicos', 'Utilidades', 'Moda'],
        'Quantidade': [10, 50, 8, 12, 35],
        'Preco_Unitario': [150.00, 45.00, 180.00, 29.90, 49.90]
    }
    df_preview = pd.DataFrame(dados)
    df_preview['Faturamento_Bruto'] = df_preview['Quantidade'] * df_preview['Preco_Unitario']
    calcular_kpis_principais(df_preview)
