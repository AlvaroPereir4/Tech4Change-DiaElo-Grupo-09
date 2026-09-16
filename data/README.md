# Dados

## Como obter

O CSV nao e versionado (licenca do Kaggle). Baixe e coloque aqui:

1. https://www.kaggle.com/datasets/ziya07/adolescent-stress-physiology-dataset
2. Salve como `data/raw/ASD_Physiological_Stress_Dataset.csv`

## Schema

25.000 linhas, 16 colunas, 120 sujeitos (~208 leituras cada). Sem nulos, sem duplicatas.

| Coluna | Usada? | Observacao |
|---|---|---|
| `Subject_ID` | split | agrupa o split treino/teste |
| `Heart_Rate` | **feature** | bpm |
| `RMSSD` | **feature** | variabilidade da FC (ms) |
| `Activity_Index` | **feature** | proxy de movimento |
| `Time_of_Day` | **feature** + narrativa | hora inteira 0-23 |
| `Stress_Label` | alvo | 0 calmo / 1 intermediario / 2 ativado |
| `Age`, `Sex`, `AQ_Total`, `Anxiety_Disorder` | nao | perfil, nao vem do relogio |
| `SDNN`, `SCL_mean`, `SCR_Frequency`, `Respiration_Rate`, `Skin_Temperature`, `Noise_Level` | nao | exigem sensor de laboratorio (EDA, respiracao) |

## Limitacoes conhecidas (ler antes de citar metricas)

**1. O dataset e sintetico, ou muito proximo disso.** As classes se separam quase
linearmente: as medias por rotulo caem em degraus regulares
(FC 75 / 90 / 105 bpm, RMSSD 45 / 25 / 15 ms) e as correlacoes com o alvo sao
altissimas (`Heart_Rate` 0.87, `RMSSD` -0.88). Dado fisiologico real nao se
comporta assim. Consequencia direta: os ~95% de F1-macro medem o quanto o
modelo aprendeu a regra que gerou os dados, **nao** o desempenho esperado com
um smartwatch real. Trate a metrica como validacao de que o pipeline funciona,
nao como evidencia de eficacia.

**2. `Time_of_Day` nao prediz nada.** Correlacao 0.003 com o alvo; a
distribuicao dos rotulos e uniforme nas 24 horas. Importancia no modelo: 0.009
somando seno e cosseno. A hora fica no pipeline porque e o eixo da camada de
traducao (agregar insights por periodo do dia), nao porque ajuda a classificar.

**3. Sao adolescentes, nao criancas.** Faixa etaria 12-18 anos. O produto fala
de criancas autistas; o modelo nunca viu essa populacao.

**4. O rotulo e "estresse fisiologico", nao crise nem emocao.** Ativacao
autonomica sobe com exercicio, susto, animacao e febre. Por isso a saida do
modelo nao vai para a tela: a API traduz para pergunta reflexiva.

## Limpeza aplicada

`src/lightpulse/data/loader.py` descarta linhas fora de faixa fisiologica
plausivel. No dataset atual: 78 de 25.000 linhas (~0,3%), quase todas
`Activity_Index` acima de 10.
