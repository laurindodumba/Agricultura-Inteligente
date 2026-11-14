# RecomendaCultura

Sistema de recomendação de culturas agrícolas baseado em Machine Learning. O projeto combina uma interface web em React com uma API em FastAPI para analisar dados do solo e do clima e sugerir a cultura mais adequada.

## Visão geral

A aplicação recebe as seguintes informações:

- Nitrogênio (N)
- Fósforo (P)
- Potássio (K)
- Temperatura
- Umidade
- pH do solo
- Chuva

Com esses dados, o modelo classifica a cultura com maior compatibilidade, retornando também o nível de confiança da previsão.

## Tecnologias utilizadas

- Frontend: React + Vite
- Backend: FastAPI
- Modelagem: scikit-learn
- Classificador: RandomForestClassifier
- Dados: conjunto de recomendação de culturas agrícolas

## Estrutura do projeto

```text
ML Recomendação/
├── backend/
│   ├── app.py
│   ├── modelo.pkl
│   ├── Crop_recommendation.csv
│   ├── train_model.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── ml/
│   └── ambiente virtual do Python
├── package.json
├── package-lock.json
└── README.md
```

## Como funciona

1. O usuário preenche os dados do solo e clima no frontend.
2. A interface envia uma requisição POST para a API.
3. O backend recebe os dados e monta um DataFrame com os valores.
4. O modelo treinado faz a previsão da cultura.
5. A resposta retorna o nome da cultura recomendada e a confiança do modelo.

## Requisitos

- Node.js 18+
- Python 3.10+
- npm
- pip

## Como executar

### 1) Backend

No diretório `backend`, crie e ative um ambiente virtual e instale as dependências:

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate
pip install -r requirements.txt
```

Para iniciar a API:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

A API ficará disponível em:

- http://127.0.0.1:8000

### 2) Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend normalmente fica em:

- http://localhost:5173

Se necessário, configure a variável de ambiente para apontar para a API:

```bash
VITE_API_URL=http://127.0.0.1:8000
```

## Endpoint principal

### POST /predict

Recebe os dados de entrada no formato JSON:

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.88,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 200.0
}
```

Resposta esperada:

```json
{
  "crop": "rice",
  "confidence": 96.42
}
```

## Treinamento do modelo

O arquivo `backend/train_model.py` treina um modelo `RandomForestClassifier` com o dataset `Crop_recommendation.csv` e salva o modelo em `backend/modelo.pkl`.

Para treinar novamente:

```bash
cd backend
python train_model.py
```

## Observações

Este projeto é uma ferramenta de apoio à decisão agronômica. A recomendação do modelo deve ser usada como orientação inicial e complementada por avaliação local, análise de solo e experiência técnica do produtor.

## Autor

Projeto desenvolvido para demonstração de aplicação de Machine Learning em recomendação de culturas agrícolas.
