# --- Coletor Inteligente de Cotações Financeiras ---
# Autor: Hubert
# Descrição: Web Scraper robusto para buscar cotações do dólar,
# euro e principais indicadores econômicos usando BeautifulSoup.

import requests
from bs4 import BeautifulSoup
import json
import time

def buscar_cotacoes():
    """Consome portal econômico e extrai taxas cambiais vigentes."""
    url = "https://www.cambio-hoje.com.br"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Seletores simulando extração de dados cambiais estruturados
        dolar_valor = soup.find("span", {"id": "cotacao-dolar"}).text.strip()
        euro_valor = soup.find("span", {"id": "cotacao-euro"}).text.strip()
        
        cotacoes = {
            "dolar": dolar_valor,
            "euro": euro_valor,
            "status": "sucesso",
            "timestamp": time.time()
        }
        
        print("🌍 Cotações extraídas com sucesso:")
        print(json.dumps(cotacoes, indent=2))
        return cotacoes
        
    except Exception as e:
        # Fallback de teste local
        print(f"⚠️ Ambiente sem conexão Web ou seletor alterado. Usando fallback de cotações.")
        fallback = {
            "dolar": "R$ 5.42",
            "euro": "R$ 5.86",
            "status": "fallback_simulado",
            "timestamp": time.time()
        }
        print(json.dumps(fallback, indent=2))
        return fallback

if __name__ == "__main__":
    buscar_cotacoes()
