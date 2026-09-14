# Kronos

Sistema de gestão de contratos e cobranças — cadastro de clientes, serviços (à vista ou parcelados) e acompanhamento de parcelas e recebimentos, com dashboard de previsão financeira. Feito para uso via web e responsivo para celular.

## Funcionalidades

- **Login** — sistema protegido por autenticação; o primeiro acesso cria a conta de administrador.
- **Minha conta**: trocar nome, e-mail e senha a qualquer momento.
- **Recuperação de senha**: sem depender de e-mail — usa uma chave mestra (`RECOVERY_SECRET`) que só quem administra o ambiente possui.
- **Comprovante de pagamento**: anexar uma imagem ou PDF a cada parcela paga.
- **Clientes**: cadastro, edição e exclusão, com página própria centralizando todos os serviços.
- **Clientes master + clientes finais**: um cliente pode ter "clientes finais" vinculados (ex: uma agência que fatura por vários clientes dela) — os serviços ficam organizados por cliente final, mas a cobrança fica centralizada no cliente master.
- **Serviços**: pagamento único ou parcelado (mês a mês), com geração automática do cronograma de parcelas a partir da data do primeiro pagamento. Serviços sem parcela paga podem ser editados livremente; depois do primeiro pagamento, só a descrição pode ser alterada (evita corromper o histórico).
- **Cronograma de parcelas**: linha do tempo visual por serviço, com marcação de pago/pendente/atrasado, recolhível para não poluir a tela quando há muitos contratos.
- **Histórico**: serviços 100% quitados saem da lista de ativos e vão para uma seção de histórico recolhida.
- **Dashboard**: previsto do mês atual e do mês seguinte (com comparativo percentual), total a receber, contratos e serviços ativos, alerta de vencimentos de hoje e dos próximos dias, gráfico de recebimentos por mês e atividade recente.
- **Busca rápida de clientes**, filtros e ordenação na listagem (por nome, valor a receber, próximo vencimento).
- **Exportar dados**: baixa um backup completo (JSON) de clientes, serviços e parcelas.
- **Tema claro/escuro** com alternância manual e persistência da preferência.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 7](https://www.prisma.io) com SQLite via `@prisma/adapter-libsql` (fácil de migrar para um banco hospedado depois)
- [date-fns](https://date-fns.org) para cálculo de datas/parcelas
- Autenticação própria (sem dependência externa): senha com hash `scrypt`, sessão em cookie assinado com HMAC/Web Crypto, validada num `proxy.ts` (o antigo `middleware.ts`)

## Como rodar localmente

Pré-requisitos: Node.js 20+.

```bash
npm install
cp .env.example .env      # e gere um AUTH_SECRET (veja o comando dentro do arquivo)
npx prisma migrate dev    # cria o banco SQLite local (dev.db) e aplica as migrations
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — na primeira vez ele vai pedir para criar a conta de administrador.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Conexão do banco. Local: `file:./dev.db`. Em produção, veja o aviso abaixo. |
| `AUTH_SECRET` | Chave usada para assinar os cookies de sessão. Gere com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Obrigatória em produção. |
| `RECOVERY_SECRET` | Chave mestra para redefinir a senha de qualquer conta em `/recuperar-senha`, sem e-mail. Gere com `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`. Guarde como uma senha — quem a tiver pode redefinir o login de qualquer conta. Sem ela configurada, a recuperação fica desativada. |

## ⚠️ Antes de colocar em produção (ex: Vercel)

O banco hoje é um **arquivo SQLite local** (`dev.db`). Isso funciona bem localmente, mas **não funciona em produção na Vercel** — o sistema de arquivos lá é somente leitura (fora de `/tmp`, que é apagado a cada execução), então os dados não seriam salvos de verdade.

Antes do deploy, troque o banco por um SQLite hospedado — como o [Turso](https://turso.tech) — que é compatível com o driver `@prisma/adapter-libsql` já usado no projeto, exigindo só a troca da `DATABASE_URL` (e um token de autenticação) nas variáveis de ambiente da Vercel. Não é preciso trocar nenhum código.

Não esqueça também de configurar `AUTH_SECRET` nas variáveis de ambiente da Vercel — sem ela, o login não funciona em produção.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Roda o build de produção |
| `npm run lint` | Roda o ESLint |

## Estrutura do projeto

```
prisma/schema.prisma         Modelo de dados (User, Client, SubClient, Service, Installment)
src/proxy.ts                 Protege as rotas: redireciona para /login sem sessão válida
src/app/login/                Tela de login / criação da primeira conta
src/app/recuperar-senha/      Redefinição de senha via chave mestra (RECOVERY_SECRET)
src/app/(app)/                Rotas autenticadas: dashboard, clientes, sub-clientes, minha conta
src/app/api/                  Busca de clientes, sub-clientes, exportação de dados e comprovantes
src/components/               Componentes de UI, agrupados por domínio (auth, clients, services, dashboard, layout, ui)
src/lib/                      Server actions, queries do banco, autenticação, regras de negócio (parcelas, datas, formatação)
src/hooks/                    Hooks compartilhados no client
```
