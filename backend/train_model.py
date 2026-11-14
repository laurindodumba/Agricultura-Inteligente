import pandas as pd
import joblib
from pathlib import Path


from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


# Extração dos dados
BASE_DIR = Path(__file__).resolve().parent
data = pd.read_csv(BASE_DIR / 'Crop_recommendation.csv')


#Separação da base de dados entre treino e Teste
x = data[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]

y = data["label"]

# Treianmento
X_train, X_test, y_train, y_test = train_test_split(
    x,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y

)

#Treinar o modelo
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Ajustar o modelo
model.fit(X_train, y_train)
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Acuracia do modelo: {accuracy * 100:.2f}%")
joblib.dump(model, BASE_DIR / "modelo.pkl")

print("Modelo salvo.pkl")
