# 🤵🏻‍♂️ Alfred

Alfred é um app local para baixar músicas do YouTube em MP3, com interface web e adição automática de metadados via MusicBrainz.

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- [FFmpeg](https://ffmpeg.org/download.html) instalado e no PATH
- Google Chrome instalado (usado pelo Selenium como fallback)

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/lucasmpa/alfred-bot.git
cd alfred-bot
```

### 2. Backend (Python)

```bash
python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Frontend (Node)

```bash
cd client
npm install
```

### 4. Configurar o domínio local (opcional)

Para acessar via `http://alfred.bot` em vez de `http://localhost`.

Adicione ao arquivo de hosts do seu sistema:

| OS | Arquivo |
|---|---|
| Mac/Linux | `/etc/hosts` |
| Windows | `C:\Windows\System32\drivers\etc\hosts` |

```
127.0.0.1 alfred.bot
```

**Mac/Linux:**
```bash
echo "127.0.0.1 alfred.bot" | sudo tee -a /etc/hosts
```

---

## Iniciando

Abra **dois terminais** na raiz do projeto.

### Terminal 1 — API

```bash
# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

python api.py
```

A API ficará disponível em `http://localhost:8000`.

### Terminal 2 — Frontend

```bash
cd client

# Mac/Linux (porta 80 requer sudo)
sudo npm run dev

# Windows
npm run dev
```

Acesse em:
- `http://alfred.bot` (se configurou o hosts)
- `http://localhost` (alternativa)

---

## Estrutura do projeto

```
alfred-bot/
├── api.py                        # API Flask
├── requirements.txt
├── src/
│   └── engines/
│       ├── download_engine.py    # Download + conversão MP3
│       ├── metadata_engine.py    # Metadados via MusicBrainz
│       └── search_engine.py      # Busca via Selenium (fallback)
└── client/                       # Frontend React + Vite
    ├── src/
    │   ├── App.tsx
    │   ├── api.ts
    │   ├── types.ts
    │   └── components/
    └── vite.config.ts
```
