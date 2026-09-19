"""Treino do classificador de estado fisiologico.

Decisoes que valem registro:

* **Split por sujeito (GroupShuffleSplit).** Sao 120 individuos com ~208
  leituras cada. Um split aleatorio por linha colocaria o mesmo individuo no
  treino e no teste, e a metrica mediria memorizacao, nao generalizacao.
* **Baseline explicito.** Um DummyClassifier roda junto. Acuracia alta so
  significa alguma coisa comparada ao chute da classe majoritaria.
* **Bundle, nao modelo cru.** O .pkl guarda a ordem das features e as metricas
  junto do estimador, para a API validar o que recebe.
"""

import argparse
import json
from datetime import datetime, timezone

import joblib
import numpy as np
import sklearn
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.model_selection import GroupKFold, GroupShuffleSplit, cross_val_score

from diaelo.config import (
    LABEL_NAMES,
    MODEL_FEATURES,
    MODEL_FILE,
    MODELS_DIR,
    RANDOM_SEED,
    REPORTS_DIR,
    TEST_SIZE,
)
from diaelo.data.features import build_xy
from diaelo.data.loader import load_clean


def split_by_subject(X, y, groups, test_size=TEST_SIZE, seed=RANDOM_SEED):
    """Separa treino/teste sem que um mesmo Subject_ID apareca nos dois lados."""
    splitter = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=seed)
    train_idx, test_idx = next(splitter.split(X, y, groups))
    return (
        X.iloc[train_idx],
        X.iloc[test_idx],
        y.iloc[train_idx],
        y.iloc[test_idx],
        groups.iloc[train_idx],
    )


def build_model(seed=RANDOM_SEED) -> RandomForestClassifier:
    return RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=5,
        class_weight="balanced",  # classe 0 e ~2x as outras
        n_jobs=-1,
        random_state=seed,
    )


def train(seed: int = RANDOM_SEED, cv_folds: int = 5) -> dict:
    df, cleaning = load_clean()
    print(f"[dados] {cleaning.summary()}")
    print(f"[dados] {df['Subject_ID'].nunique()} sujeitos")

    X, y, groups = build_xy(df)
    X_train, X_test, y_train, y_test, groups_train = split_by_subject(X, y, groups, seed=seed)
    print(
        f"[split] treino {len(X_train)} linhas / {groups_train.nunique()} sujeitos "
        f"| teste {len(X_test)} linhas / {groups.iloc[X_test.index].nunique()} sujeitos"
    )

    baseline = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
    baseline_acc = accuracy_score(y_test, baseline.predict(X_test))

    model = build_model(seed).fit(X_train, y_train)
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average="macro")

    cv = cross_val_score(
        build_model(seed), X_train, y_train, groups=groups_train,
        cv=GroupKFold(n_splits=cv_folds), scoring="f1_macro", n_jobs=-1,
    )

    target_names = [LABEL_NAMES[i] for i in sorted(LABEL_NAMES)]
    print(f"\n[baseline] acuracia (classe majoritaria): {baseline_acc:.3f}")
    print(f"[modelo]   acuracia: {acc:.3f} | F1-macro: {macro_f1:.3f}")
    print(f"[modelo]   CV {cv_folds}-fold por sujeito, F1-macro: {cv.mean():.3f} +/- {cv.std():.3f}")
    print("\n" + classification_report(y_test, y_pred, target_names=target_names, digits=3))
    print("Matriz de confusao (linha = real, coluna = predito):")
    print(confusion_matrix(y_test, y_pred))

    importances = dict(
        sorted(
            zip(MODEL_FEATURES, model.feature_importances_.round(4).tolist()),
            key=lambda kv: kv[1],
            reverse=True,
        )
    )
    print("\n[importancia das features]")
    for name, value in importances.items():
        print(f"  {name:<16} {value:.4f}")

    metrics = {
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "seed": seed,
        "rows_train": len(X_train),
        "rows_test": len(X_test),
        "subjects_train": int(groups_train.nunique()),
        "baseline_accuracy": round(float(baseline_acc), 4),
        "accuracy": round(float(acc), 4),
        "macro_f1": round(float(macro_f1), 4),
        "cv_macro_f1_mean": round(float(cv.mean()), 4),
        "cv_macro_f1_std": round(float(cv.std()), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "per_class": classification_report(
            y_test, y_pred, target_names=target_names, output_dict=True, zero_division=0
        ),
        "feature_importances": importances,
    }

    bundle = {
        "model": model,
        "feature_order": MODEL_FEATURES,
        "label_names": LABEL_NAMES,
        "sklearn_version": sklearn.__version__,
        "metrics": metrics,
    }

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, MODEL_FILE, compress=3)  # ~4x menor, cabe no repositorio
    (REPORTS_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"\n[artefato] {MODEL_FILE}")
    print(f"[artefato] {REPORTS_DIR / 'metrics.json'}")

    return metrics


def main() -> None:
    parser = argparse.ArgumentParser(description="Treina o modelo DiaElo.")
    parser.add_argument("--seed", type=int, default=RANDOM_SEED)
    parser.add_argument("--cv-folds", type=int, default=5)
    args = parser.parse_args()
    np.random.seed(args.seed)
    train(seed=args.seed, cv_folds=args.cv_folds)


if __name__ == "__main__":
    main()
