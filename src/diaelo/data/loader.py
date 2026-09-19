"""Carga e limpeza do ASD-PhysioStress.

O dataset publico vem limpo (sem nulos, sem duplicatas), mas o mesmo codigo
precisa aguentar leitura real de smartwatch, que vem suja. Por isso a
validacao e a limpeza sao explicitas e reportadas, nao silenciosas.
"""

from dataclasses import dataclass, field
from pathlib import Path

import pandas as pd

from diaelo.config import DATASET_FILE, GROUP_COL, SENSOR_FEATURES, SENSOR_RANGES, TARGET


@dataclass
class CleaningReport:
    """O que a limpeza mexeu. Serve para log e para o README do modelo."""

    rows_in: int = 0
    rows_out: int = 0
    dropped_nulls: int = 0
    dropped_duplicates: int = 0
    dropped_out_of_range: dict[str, int] = field(default_factory=dict)

    def summary(self) -> str:
        oor = ", ".join(f"{k}={v}" for k, v in self.dropped_out_of_range.items() if v) or "nenhuma"
        return (
            f"{self.rows_in} linhas -> {self.rows_out} "
            f"(nulos: {self.dropped_nulls}, duplicatas: {self.dropped_duplicates}, "
            f"fora de faixa: {oor})"
        )


REQUIRED_COLUMNS = [*SENSOR_FEATURES, TARGET, GROUP_COL]


def load_raw(path: Path | None = None) -> pd.DataFrame:
    """Le o CSV bruto e garante que o schema esperado esta presente."""
    path = path or DATASET_FILE
    if not path.exists():
        raise FileNotFoundError(
            f"Dataset nao encontrado em {path}.\n"
            "Baixe de https://www.kaggle.com/datasets/ziya07/adolescent-stress-physiology-dataset "
            "e coloque o CSV em data/raw/ (ver data/README.md)."
        )
    df = pd.read_csv(path)
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Colunas ausentes no dataset: {missing}")
    return df


def clean(df: pd.DataFrame) -> tuple[pd.DataFrame, CleaningReport]:
    """Remove linhas inutilizaveis e devolve o relatorio do que saiu."""
    report = CleaningReport(rows_in=len(df))

    before = len(df)
    df = df.dropna(subset=REQUIRED_COLUMNS)
    report.dropped_nulls = before - len(df)

    before = len(df)
    df = df.drop_duplicates()
    report.dropped_duplicates = before - len(df)

    for col, (lo, hi) in SENSOR_RANGES.items():
        before = len(df)
        df = df[df[col].between(lo, hi)]
        report.dropped_out_of_range[col] = before - len(df)

    df = df[df[TARGET].isin([0, 1, 2])]

    report.rows_out = len(df)
    return df.reset_index(drop=True), report


def load_clean(path: Path | None = None) -> tuple[pd.DataFrame, CleaningReport]:
    """Atalho: carrega e limpa em um passo."""
    return clean(load_raw(path))
