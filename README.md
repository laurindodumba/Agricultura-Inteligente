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

## Publicar na Netlify

A Netlify publica a interface React. A API FastAPI precisa estar publicada em um serviço que execute Python (por exemplo, Render ou Railway) antes de a recomendação funcionar em produção.

Site publicado: https://creative-cassata-54a155.netlify.app/

1. Envie este projeto para um repositório Git e conecte o repositório à Netlify.
2. A configuração em `netlify.toml` define a pasta base (`frontend`), o comando de build (`npm run build`) e a pasta publicada (`dist`).
3. Nas configurações do site na Netlify, adicione a variável de ambiente `VITE_API_URL` com a URL pública da API, sem `/` no final, por exemplo `https://sua-api.onrender.com`. A URL do site é `https://creative-cassata-54a155.netlify.app/`.
4. Faça um novo deploy depois de salvar a variável.

Para publicar a API no Render, crie um Blueprint a partir deste repositório. O arquivo `render.yaml` configura a pasta `backend`, instala `requirements.txt`, inicia o FastAPI e define a origem do frontend. O Render fornecerá uma URL pública `https://...onrender.com` quando a implantação terminar.

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

A API carrega `modelo.pkl` e o dataset a partir da própria pasta `backend`. Depois que o Render fornecer a URL da API, adicione-a na Netlify como `VITE_API_URL` e faça um novo deploy do frontend. Se usar um domínio próprio na Netlify, altere `FRONTEND_ORIGIN` no `render.yaml` para a origem exata desse domínio.

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

## By: Laurindo Dumba
