# Nola Analytics - Quick Start Guide

## ✅ Status do Projeto

### Concluído:
- ✅ Banco de dados PostgreSQL configurado (510.154 registros)
- ✅ Prisma migrations aplicadas
- ✅ 500.000 registros de vendas
- ✅ 50 lojas, 100 produtos, 4 canais, 10.000 clientes
- ✅ Schemas Cube.js criados
- ✅ Interface Next.js completa
- ✅ Dashboard builder interativo
- ✅ API REST para persistência de dashboards

### Próximo Passo:
🔧 **Configurar e iniciar servidor Cube.js**

## 🚀 Como Executar o Projeto

### Opção 1: Usar Cube Cloud (Recomendado - Mais Rápido)

1. **Criar conta no Cube Cloud**
   ```
   https://cube.dev/cloud
   ```

2. **Criar novo deployment**
   - Escolha "PostgreSQL" como data source
   - Configure a conexão:
     - Host: `localhost` (ou seu IP público se estiver expondo o PostgreSQL)
     - Port: `5432`
     - Database: `Nola`
     - User: `postgres`
     - Password: `1234`

3. **Fazer upload dos schemas**
   - Vá para a aba "Data Model"
   - Faça upload dos arquivos da pasta `cube-schema/`:
     - Sales.js
     - Products.js
     - Stores.js
     - Channels.js
     - Customers.js

4. **Copiar credenciais**
   - Na aba "Settings", copie:
     - API URL
     - API Secret
   - Cole no arquivo `.env`:
     ```env
     NEXT_PUBLIC_CUBEJS_API_URL="https://seu-deployment.cubecloud.dev/cubejs-api/v1"
     NEXT_PUBLIC_CUBEJS_API_SECRET="seu-secret-token"
     ```

5. **Iniciar aplicação Next.js**
   ```powershell
   npm run dev
   ```

6. **Acessar**
   ```
   http://localhost:3000
   ```

### Opção 2: Cube.js Local

1. **Instalar Cube CLI globalmente**
   ```powershell
   npm install -g cubejs-cli
   ```

2. **Criar projeto Cube.js em diretório separado**
   ```powershell
   cd ..
   cubejs create cube-server -d postgres
   cd cube-server
   ```

3. **Configurar `.env` do Cube.js**
   ```env
   CUBEJS_DB_TYPE=postgres
   CUBEJS_DB_HOST=localhost
   CUBEJS_DB_PORT=5432
   CUBEJS_DB_NAME=Nola
   CUBEJS_DB_USER=postgres
   CUBEJS_DB_PASS=1234
   CUBEJS_API_SECRET=mysecrettoken
   ```

4. **Copiar schemas**
   ```powershell
   Copy-Item ..\nola-analytics\cube-schema\*.js schema\
   ```

5. **Iniciar servidor Cube.js**
   ```powershell
   npm run dev
   ```
   - Cube.js estará disponível em `http://localhost:4000`
   - Playground: `http://localhost:4000`

6. **Em outro terminal, iniciar Next.js**
   ```powershell
   cd ..\nola-analytics
   npm run dev
   ```

7. **Acessar aplicação**
   ```
   http://localhost:3000
   ```

## 📊 Testar a Aplicação

### 1. Página Inicial
```
http://localhost:3000
```
- Visão geral do projeto
- Links para dashboard

### 2. Dashboard de Exemplo
```
http://localhost:3000/dashboard
```
- 6 widgets pré-configurados
- Mostra: Revenue total, orders, delivery time, revenue por canal, etc.

### 3. Dashboard Builder
```
http://localhost:3000/dashboard/new
```
- Criar dashboards customizados
- Adicionar gráficos drag-and-drop
- Escolher métricas e dimensões
- Salvar no banco de dados

## 🔧 Comandos Úteis

```powershell
# Desenvolvimento
npm run dev              # Iniciar Next.js
npm run build            # Build para produção
npm start                # Iniciar produção

# Database
npm run db:migrate       # Criar/aplicar migrations
npm run db:studio        # Abrir Prisma Studio (GUI do banco)
npm run seed             # Popular banco com dados (já executado)

# Qualidade
npm run lint             # Verificar código
npx tsc --noEmit         # Verificar tipos TypeScript
```

## 📁 Estrutura do Projeto

```
nola-analytics/
├── app/                     # Next.js App Router
│   ├── api/dashboards/      # API REST endpoints
│   ├── dashboard/           # Páginas de dashboard
│   │   ├── page.tsx         # Dashboard exemplo
│   │   └── new/page.tsx     # Dashboard builder
│   └── page.tsx             # Home page
├── components/              # Componentes React
│   ├── Chart.tsx            # Componente de gráfico
│   └── DashboardGrid.tsx    # Grid drag-and-drop
├── lib/                     # Utilitários
│   ├── cubejs.ts            # Cliente Cube.js
│   └── prisma.ts            # Cliente Prisma
├── prisma/                  # Database ORM
│   ├── schema.prisma        # Schema do banco
│   └── migrations/          # Migrations SQL
├── scripts/                 # Scripts utilitários
│   └── seed-data.ts         # Popular banco
├── cube-schema/             # Schemas Cube.js
│   ├── Sales.js
│   ├── Products.js
│   ├── Stores.js
│   ├── Channels.js
│   └── Customers.js
└── .env                     # Variáveis de ambiente
```

## 🎯 Perguntas de Negócio

O sistema está pronto para responder:

1. **"Qual produto vende mais às quintas à noite no iFood?"**
   - Measure: `Sales.count`
   - Dimensions: `Products.name`, `Channels.name`, `Sales.dayOfWeek`, `Sales.hourOfDay`
   - Filters: Channel = "iFood", Day = "Thursday", Hour >= 18

2. **"Meu tempo de entrega piorou. Em quais regiões?"**
   - Measure: `Sales.avgDeliveryTime`
   - Dimension: `Stores.region`
   - Time comparison: Last month vs This month

3. **"Quais clientes compraram 3+ vezes mas não voltaram em 30 dias?"**
   - Needs custom query with Customers join and date filters

## 🚨 Troubleshooting

### Erro: "Can't reach database"
- Verifique se o pgAdmin está rodando
- Confirme credenciais no `.env`

### Erro: "CUBEJS_API_URL not configured"
- Configure o Cube.js (Cloud ou local)
- Atualize `.env` com URL e Secret corretos

### Charts não carregam
- Verifique se Cube.js está rodando
- Abra `http://localhost:4000` para testar Cube.js
- Verifique console do navegador para erros

## 📝 Próximos Passos Recomendados

1. ✅ **Configurar Cube.js** (escolher Cloud ou Local)
2. ⏭️ **Testar dashboard example**
3. ⏭️ **Criar dashboard customizado**
4. ⏭️ **Adicionar filtros de data**
5. ⏭️ **Implementar autenticação**
6. ⏭️ **Deploy em produção (Vercel + Cube Cloud)**
7. ⏭️ **Gravar vídeo demo**
8. ⏭️ **Documentar decisões arquiteturais**

## 🎬 Para o Desafio

**Submeter até 03/11/2025 para:** gsilvestre@arcca.io

**Inclua:**
1. Link do repositório
2. Link da aplicação (se deployada)
3. Vídeo demo (5-10 min)
4. Documento de decisões arquiteturais

---

**Dúvidas?**
- Discord: https://discord.gg/z8pVH26j
- Email: gsilvestre@arcca.io
- Phone: (11) 93016-3509
