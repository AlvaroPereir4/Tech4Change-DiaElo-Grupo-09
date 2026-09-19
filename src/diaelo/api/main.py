"""API HTTP do DiaElo.

Camada fina sobre `diaelo.insights`, usando os mesmos contratos Pydantic.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from diaelo.insights.contracts import InsightRequest, InsightResponse
from diaelo.insights.engine import generate_insights
from diaelo.insights.predictor import load_bundle


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Carrega o modelo no boot. Sem o artefato, o serviço não sobe."""
    app.state.bundle = load_bundle()
    yield


app = FastAPI(
    title="DiaElo API",
    description=(
        "Dados que viram cuidado, não diagnóstico.\n\n"
        "Envie as leituras de um dia e receba o dia descrito por período, "
        "em números medidos.\n\n"
        "**Para testar:** abra POST /insights, clique em *Try it out* e em "
        "*Execute*. O corpo já vem preenchido com um dia de exemplo."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# Aberto para o MVP. Antes de uso real, restringir à origem do cliente.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health", tags=["infra"])
def health() -> dict:
    """Estado do serviço e do modelo carregado."""
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
    """Recebe as leituras de uma janela e devolve as observações por período."""
    return generate_insights(request, bundle=app.state.bundle)
