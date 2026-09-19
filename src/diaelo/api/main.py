"""API HTTP do DiaElo.

Camada fina: valida, chama o motor de insights e devolve. Toda a regra vive
em `diaelo.insights`, e os contratos Pydantic de `insights.contracts` são
os mesmos usados aqui -- então o schema do OpenAPI é gerado a partir da fonte
da verdade, não de uma cópia que pode divergir.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from diaelo.insights.contracts import InsightRequest, InsightResponse
from diaelo.insights.engine import generate_insights
from diaelo.insights.predictor import load_bundle


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Carrega o modelo no boot.

    De propósito falha aqui se o artefato não existir: é melhor o container
    não subir do que subir e devolver erro na primeira requisição real.
    """
    app.state.bundle = load_bundle()
    yield


app = FastAPI(
    title="DiaElo API",
    description="Dados que viram cuidado, não diagnóstico.",
    version="0.1.0",
    lifespan=lifespan,
)

# O app da família roda em outra origem. Aberto para o MVP; antes de qualquer
# uso real, restringir à origem do cliente.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health", tags=["infra"])
def health() -> dict:
    """Usado pelo deploy para saber se o processo está saudável."""
    bundle = getattr(app.state, "bundle", None)
    if bundle is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="modelo não carregado",
        )
    return {
        "status": "ok",
        "model": {
            "features": bundle.feature_order,
            "trained_at": bundle.metrics.get("trained_at"),
            "macro_f1": bundle.metrics.get("macro_f1"),
        },
    }


@app.post("/insights", response_model=InsightResponse, tags=["insights"])
def insights(request: InsightRequest) -> InsightResponse:
    """Recebe as leituras de uma janela e devolve as observações do período.

    Leitura fora de faixa fisiológica não é erro: entra na resposta como
    descarte contabilizado. Só a requisição malformada é rejeitada, e disso
    o Pydantic cuida antes de chegar aqui.
    """
    return generate_insights(request, bundle=app.state.bundle)
