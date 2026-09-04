# Finanly

Aplicativo de finanças pessoais em React + Vite.

## Requisitos

- Node.js 18+
- npm

## Como rodar em modo desenvolvimento

```bash
npm install
npm run dev -- --host 0.0.0.0
```

A aplicação ficará disponível em http://localhost:5173.

## Como gerar a build de produção

```bash
npm run build
```

## Como rodar a versão de produção localmente

```bash
npm run preview -- --host 0.0.0.0
```

A preview fica em http://localhost:4173.

## Variáveis de ambiente

Crie um arquivo `.env.local` com as variáveis que o app possa precisar. Exemplo:

```env
VITE_APP_NAME=Finanly
VITE_APP_BASE_URL=http://localhost:5173
```

> O projeto foi refatorado para funcionar como uma aplicação standalone, sem depender de integração do Base44 nem de parâmetros embutidos na URL.
