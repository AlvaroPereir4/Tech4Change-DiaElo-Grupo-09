# Especificação da API — entrada e saída

Referência para o consumo da API.

---

## Fluxo

```
relógio ──(1 leitura a cada ~10 min)──> app acumula ──(1 request/dia)──> API ──> telas
```

O app acumula as leituras localmente durante o dia e envia **tudo de uma vez**,
com o dia fechado. Não é uma chamada por leitura. Se enviar com o dia em
andamento, mande só os períodos já completos.

---

## Entrada

`readings` é a lista de **todas** as leituras do dia: ~144 objetos, ~17 KB.

```json
{
  "child_id": "anon-7f3a",
  "min_readings_per_period": 6,
  "readings": [
    { "timestamp": "2026-09-15T07:02:00-03:00", "heart_rate": 78.4,  "rmssd": 41.2, "activity_index": 0.52 },
    { "timestamp": "2026-09-15T07:12:00-03:00", "heart_rate": 81.0,  "rmssd": 38.7, "activity_index": 0.61 },
    { "timestamp": "2026-09-15T14:32:00-03:00", "heart_rate": 102.4, "rmssd": 18.2, "activity_index": 1.05 }
  ]
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `child_id` | string | sim | Identificador anônimo. Nunca o nome da criança. |
| `readings` | array | sim, ≥1 | Todas as leituras da janela. |
| `min_readings_per_period` | int ≥1 | não (padrão `6`) | Abaixo disso o período volta como inconclusivo. |

### `readings[]`

| Campo | Tipo | Unidade | Descrição |
|---|---|---|---|
| `timestamp` | ISO 8601 **com fuso** | — | Momento da leitura. O período do dia é derivado daqui no backend — o app não envia período. |
| `heart_rate` | float | bpm | Frequência cardíaca média da janela. |
| `rmssd` | float | ms | Variabilidade da frequência cardíaca. |
| `activity_index` | float | — | Proxy de movimento do acelerômetro. |

### Validação

- Campo ausente, tipo errado, `NaN`/infinito ou `readings` vazio → **request rejeitado**.
- Valor fora da faixa fisiológica → **aceito no request, descartado no processamento** e contado em `readings_discarded`.

Faixas: `heart_rate` 30–220 · `rmssd` 0–200 · `activity_index` 0–10.

---

## Saída

```json
{
  "child_id": "anon-7f3a",
  "window_start": "2026-09-15T00:00:00-03:00",
  "window_end": "2026-09-15T23:50:00-03:00",
  "readings_received": 112,
  "readings_used": 110,
  "readings_discarded": 2,
  "day_activation_score": 1.145,
  "day_metrics": { "heart_rate_avg": 91.97, "rmssd_avg": 25.71, "activity_avg": 0.85 },
  "periods": [
    {
      "period": "madrugada",
      "label": "de madrugada",
      "readings_used": 2,
      "conclusive": false,
      "distribution": {},
      "predominant": null,
      "activation_score": null,
      "metrics": null,
      "observation": "Houve apenas 2 leituras de madrugada, pouco para observar um padrão. Isso costuma acontecer quando o relógio fica fora do pulso ou sem bateria."
    },
    {
      "period": "manha",
      "label": "de manhã",
      "readings_used": 36,
      "conclusive": true,
      "distribution": { "calmo": 0.528, "intermediario": 0.278, "acelerado": 0.194 },
      "predominant": "calmo",
      "activation_score": 0.667,
      "metrics": { "heart_rate_avg": 83.95, "rmssd_avg": 31.84, "activity_avg": 0.72 },
      "observation": "De manhã, os batimentos ficaram em média 84 bpm em 36 leituras, 8 bpm abaixo da média do dia (92 bpm)."
    },
    {
      "period": "tarde",
      "label": "à tarde",
      "readings_used": 36,
      "conclusive": true,
      "distribution": { "calmo": 0.0, "intermediario": 0.028, "acelerado": 0.972 },
      "predominant": "acelerado",
      "activation_score": 1.972,
      "metrics": { "heart_rate_avg": 104.53, "rmssd_avg": 13.5, "activity_avg": 1.14 },
      "observation": "À tarde, os batimentos ficaram em média 105 bpm em 36 leituras, 13 bpm acima da média do dia (92 bpm). O movimento nesse período também ficou acima do restante do dia."
    },
    {
      "period": "noite",
      "label": "à noite",
      "readings_used": 36,
      "conclusive": true,
      "distribution": { "calmo": 0.5, "intermediario": 0.167, "acelerado": 0.333 },
      "predominant": "calmo",
      "activation_score": 0.833,
      "metrics": { "heart_rate_avg": 87.77, "rmssd_avg": 31.55, "activity_avg": 0.71 },
      "observation": "À noite, os batimentos ficaram em média 88 bpm em 36 leituras, em linha com a média do dia (92 bpm)."
    }
  ],
  "data_quality_note": null,
  "disclaimer": "Estes dados descrevem sinais do corpo, não emoções nem diagnóstico. Batimentos mais altos podem vir de brincadeira, corrida ou animação. Use como ponto de partida para a conversa em família e leve as dúvidas aos profissionais que acompanham a criança."
}
```

### Raiz

| Campo | Tipo | Descrição |
|---|---|---|
| `child_id` | string | Ecoado da entrada. |
| `window_start` / `window_end` | ISO 8601 | Menor e maior `timestamp` recebidos, incluindo os descartados. |
| `readings_received` | int | Total enviado. |
| `readings_used` | int | Total aproveitado. |
| `readings_discarded` | int | Descartadas por estarem fora da faixa. |
| `day_activation_score` | float 0–2 \| `null` | Nível de ativação do dia. 0 = calmo, 2 = acelerado. |
| `day_metrics` | objeto \| `null` | Médias do dia inteiro. É a referência das comparações nos textos. |
| `periods` | array | **Sempre 4 itens**, sempre na ordem madrugada → manhã → tarde → noite. |
| `data_quality_note` | string \| `null` | Preenchido quando >20% das leituras foram descartadas. |
| `disclaimer` | string | Texto fixo. Precisa estar visível na tela. |

### `periods[]`

| Campo | Tipo | Descrição |
|---|---|---|
| `period` | `madrugada` \| `manha` \| `tarde` \| `noite` | Chave técnica, sem acento. Use para lógica, cor e ícone. |
| `label` | string | O período já flexionado para a frase ("à tarde"). |
| `readings_used` | int | Leituras aproveitadas neste período. |
| `conclusive` | bool | `false` = leituras insuficientes. Ver abaixo. |
| `distribution` | objeto | Fração das leituras em cada estado. Soma 1,0. |
| `predominant` | `calmo` \| `intermediario` \| `acelerado` \| `null` | Estado de maior fração. |
| `activation_score` | float 0–2 \| `null` | Mesma escala do `day_activation_score`. |
| `metrics` | objeto \| `null` | Médias de `heart_rate_avg`, `rmssd_avg` e `activity_avg` do período. |
| `observation` | string | **Sempre preenchida.** O que foi medido. |

Faixas horárias: madrugada 0–5 · manhã 6–11 · tarde 12–17 · noite 18–23.

### `conclusive: false`

Caso comum (relógio fora do pulso, bateria). Quando é `false`:

`distribution` = `{}` · `predominant`, `activation_score` e `metrics` = `null`
· `observation` **preenchida**, já explicando a falta.

A tela não precisa escrever texto de estado vazio — basta renderizar a
`observation`.

---

## Regra para o front

Todo texto que a família lê vem pronto do backend: `observation`,
`data_quality_note` e `disclaimer`.

O front não escreve frase própria sobre o estado da criança, não traduz
`predominant` para palavra na tela, e não usa "estresse", "crise", "alerta",
"risco" ou nome de emoção. `predominant` e `distribution` são para cor, forma e
ordenação — não para virar texto.
