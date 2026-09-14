# Kronos

Sistema de gestão de contratos e cobranças — cadastro de clientes, serviços (à vista ou parcelados) e acompanhamento de parcelas e recebimentos, com dashboard de previsão financeira. Feito para uso via web e responsivo para celular.

## Funcionalidades

- **Clientes**: cadastro, edição e exclusão, com página própria centralizando todos os serviços.
- **Clientes master + clientes finais**: um cliente pode ter "clientes finais" vinculados (ex: uma agência que fatura por vários clientes dela) — os serviços ficam organizados por cliente final, mas a cobrança fica centralizada no cliente master.
- **Serviços**: pagamento único ou parcelado (mês a mês), com geração automática do cronograma de parcelas a partir da data do primeiro pagamento.
- **Cronograma de parcelas**: linha do tempo visual por serviço, com marcação de pago/pendente/atrasado, recolhível para não poluir a tela quando há muitos contratos.
- **Histórico**: serviços 100% quitados saem da lista de ativos e vão para uma seção de histórico recolhida.
- **Dashboard**: previsto do mês atual e do mês seguinte (com comparativo percentual), total a receber, contratos e serviços ativos, alerta de vencimentos de hoje e dos próximos dias, gráfico de recebimentos por mês e atividade recente.
- **Busca rápida de clientes**, filtros e ordenação na listagem (por nome, valor a receber, próximo vencimento).
- **Tema claro/escuro** com alternância manual e persistência da preferência.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 7](https://www.prisma.io) com SQLite via `@prisma/adapter-libsql` (fácil de migrar para um banco hospedado depois)
- [date-fns](https://date-fns.org) para cálculo de datas/parcelas

## Como rodar localmente

Pré-requisitos: Node.js 20+.

```bash
npm install
npx prisma migrate dev   # cria o banco SQLite local (dev.db) e aplica as migrations
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

O banco de dados é um arquivo SQLite local (`dev.db`, ignorado pelo git). A conexão é definida em `.env`:

```
DATABASE_URL="file:./dev.db"
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Roda o build de produção |
| `npm run lint` | Roda o ESLint |

## Estrutura do projeto

```
prisma/schema.prisma        Modelo de dados (Client, SubClient, Service, Installment)
src/app/                    Rotas (App Router): dashboard, clientes, sub-clientes, API
src/components/             Componentes de UI, agrupados por domínio (clients, services, dashboard, layout, ui)
src/lib/                    Server actions, queries do banco, regras de negócio (parcelas, datas, formatação)
src/hooks/                  Hooks compartilhados no client
```
