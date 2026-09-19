# DiaElo

**Dados que viram cuidado, não diagnóstico.**

Plataforma que lê dados de smartwatches acessíveis — frequência cardíaca,
variabilidade e movimento — e os transforma em observações compreensíveis
sobre a rotina de crianças autistas.

Não detecta crises, não diagnostica emoções e não substitui profissionais.
Mostra padrões para que a família converse e decida melhor.

---

## O problema

Responsáveis de crianças autistas convivem com sinais e mudanças ao longo do
dia, mas não têm uma forma simples de transformar isso em algo compreensível.
Os dados ficam isolados no relógio, sem contexto.

Os aplicativos existentes ou são focados em exercício físico, ou disparam
alertas de possível crise — o que gera ansiedade em tempo real em vez de
entendimento. O DiaElo ocupa o espaço entre os dois: nenhum alerta,
nenhuma emergência, só o dia descrito em linguagem que a família entende.

## API

Recebe as leituras de um dia inteiro e devolve o dia organizado em quatro
períodos, cada um descrito em números que o relógio de fato mediu.

**O princípio que governa a resposta:** só se afirma o que foi medido.

Um modelo de machine learning classifica cada leitura, mas ele não aparece no
texto. As frases citam batimento, contagem de leituras e comparação com a
média do próprio dia da criança. Se o modelo errar, os textos continuam
verdadeiros — o pior caso é um insight menos interessante, nunca uma
afirmação falsa para uma família.

### Como funciona

```
relógio ──(1 leitura a cada ~10 min)──> app acumula ──(1 request/dia)──> API
                                                                         │
                          descarta leitura fisiologicamente impossível ◄──┘
                          classifica cada leitura (Random Forest)
                          agrupa por período do dia
                          descreve cada período em números medidos
                                    │
   telas  ◄─────────────────────────┘
```

A **linha de base é o próprio dia da criança**: cada período é comparado com a
média das outras leituras dela mesma. Isso dispensa histórico e funciona desde
o primeiro dia de uso.

### Endpoints

| Método | Rota | O que faz |
|---|---|---|
| `GET` | `/health` | Estado do serviço e do modelo carregado |
| `POST` | `/insights` | Recebe as leituras da janela, devolve as observações |
| `GET` | `/docs` | Documentação interativa (Swagger), gerada automaticamente |

---

## Rodando local

```bash
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt   # Linux/Mac: .venv/bin/pip
.venv/Scripts/pip install -e .
```

O modelo treinado (`models/diaelo_rf.pkl`, 4,7 MB) já vem no repositório,
então a API sobe direto:

```bash
python -m uvicorn diaelo.api.main:app --reload --port 8080
```

Documentação interativa em `http://127.0.0.1:8080/docs`.

Para retreinar, baixe o dataset (ver [data/README.md](data/README.md)) e rode:

```bash
python -m diaelo.training.train
```

### Testando

```bash
curl http://127.0.0.1:8080/health
```

```bash
curl -X POST http://127.0.0.1:8080/insights -H "Content-Type: application/json" -d @examples/request-exemplo.json
```

> No PowerShell use `curl.exe` — `curl` é apelido do `Invoke-WebRequest` e tem
> sintaxe diferente.

---

## Resumo do contrato

**Entra** um lote com todas as leituras do dia (~144 objetos num dia real,
~17 KB). Quatro campos por leitura:

```json
{ "timestamp": "2026-09-17T14:00:00-03:00", "heart_rate": 105.7, "rmssd": 15.2, "activity_index": 1.21 }
```

O período do dia é derivado do `timestamp` no backend — o app não envia
período. Leitura fisiologicamente impossível não é erro: entra como descarte
contabilizado.

**Sai** o dia em quatro períodos. Cada um traz os números medidos
(`metrics`), como as leituras se distribuíram entre calmo / intermediário /
acelerado (`distribution`), e a frase pronta (`observation`):

```json
{
  "period": "tarde",
  "label": "à tarde",
  "readings_used": 7,
  "conclusive": true,
  "distribution": { "calmo": 0.0, "intermediario": 0.143, "acelerado": 0.857 },
  "predominant": "acelerado",
  "activation_score": 1.857,
  "metrics": { "heart_rate_avg": 102.7, "rmssd_avg": 17.6, "activity_avg": 1.12 },
  "observation": "À tarde, os batimentos ficaram em média 103 bpm em 7 leituras, 15 bpm acima da média do dia (88 bpm). O movimento nesse período também ficou acima do restante do dia."
}
```

Três coisas que definem como a tela é construída:

- `periods` sempre traz os **4 períodos**, em ordem cronológica, mesmo os sem
  dado. Layout fixo, não lista dinâmica.
- Quando `conclusive` é `false`, os campos numéricos vêm nulos — mas a
  `observation` já vem preenchida explicando a falta. A tela não escreve texto
  de estado vazio.
- Todo texto que a família lê vem pronto do backend. O front não redige frase
  sobre o estado da criança.

📄 **Contrato completo, campo a campo, com exemplo integral de entrada e saída:
[docs/API.md](docs/API.md)**

Payload de exemplo pronto para usar:
[examples/request-exemplo.json](examples/request-exemplo.json) — 21 leituras,
com madrugada vazia e uma leitura impossível de 310 bpm, para exercitar os
casos de borda.

---

## O modelo

Random Forest treinado no [ASD-PhysioStress](https://www.kaggle.com/datasets/ziya07/adolescent-stress-physiology-dataset),
usando apenas variáveis que um smartwatch de baixo custo entrega:

| Feature | Importância |
|---|---|
| `RMSSD` (variabilidade da FC) | 0,50 |
| `Heart_Rate` | 0,33 |
| `Activity_Index` | 0,16 |
| Hora do dia (cíclica) | 0,01 |

O RMSSD sozinho pesa mais que os outros somados. Aplicativos de exercício
olham BPM; o marcador de ativação autonômica é a variabilidade.

O split de treino/teste é feito **por indivíduo** (`Subject_ID`), não por
linha: split aleatório colocaria o mesmo sujeito nos dois lados e a métrica
mediria memorização.

| | |
|---|---|
| F1-macro (teste) | 0,947 |
| CV 5-fold por sujeito | 0,950 ± 0,003 |
| Baseline (classe majoritária) | 0,485 |

### Leia isto antes de citar as métricas

**O dataset é sintético, ou muito próximo disso.** As classes se separam quase
linearmente, e há valores fisicamente impossíveis (RMSSD negativo). Uma árvore
de decisão de profundidade 2 atinge 90% — os 95% do Random Forest medem o
quanto ele aprendeu a fórmula que gerou os dados, **não** o desempenho
esperado com um smartwatch real.

O dataset também é de **adolescentes de 12 a 18 anos**, não de crianças, e não
contém dados de sono.

Isso não invalida o projeto: valida que o pipeline funciona ponta a ponta.
O que falta validar — se os insights ajudam famílias de verdade — exige dado
longitudinal real, que nenhuma base pública tem.

Limitações completas em [data/README.md](data/README.md).

---

## Estrutura

```
src/diaelo/
├── config.py            # contrato de dados: features, faixas, rótulos
├── data/
│   ├── loader.py        # carga, validação de schema e limpeza
│   └── features.py      # hora cíclica (modelo) vs. período do dia (narrativa)
├── training/
│   └── train.py         # split por sujeito, baseline, CV, artefato .pkl
├── insights/
│   ├── contracts.py     # entrada e saída (Pydantic)
│   ├── predictor.py     # carga do modelo e inferência em lote
│   ├── narrative.py     # camada de tradução humanizada
│   └── engine.py        # orquestração
└── api/
    └── main.py          # FastAPI
```

---

Tech4Change · DiaElo · Grupo 09
