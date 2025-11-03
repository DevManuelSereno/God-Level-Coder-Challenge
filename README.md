# 🍔 Nola Analytics

**Power BI para Restaurantes** - Plataforma de analytics que permite donos de restaurantes explorarem dados operacionais e responderem perguntas complexas de negócio.

---

## 🎯 Sobre o Projeto

Nola Analytics é uma solução de analytics desenvolvida para o desafio **God Level Coder Challenge**, criando uma plataforma tipo "Power BI" especializada para o mercado de restaurantes no Brasil.

### O Problema Real

**Persona: Maria** - Dona de 3 restaurantes em São Paulo
- Vende por 5 canais (balcão, iFood, Rappi, WhatsApp, app próprio)
- 200+ produtos no cardápio
- ~1.500 pedidos/semana
- Precisa tomar decisões diárias sobre estoque, preços, promoções

**Perguntas que Maria não consegue responder hoje:**
- "Qual produto vende mais às quintas à noite no iFood?"
- "Meu ticket médio está caindo. É por canal ou por loja?"
- "Quais produtos têm margem menor e devo repensar o preço?"
- "Meu tempo de entrega piorou. Em quais dias/horários?"
- "Quais clientes compraram 3+ vezes mas não voltam há 30 dias?"

### A Solução

Plataforma que permite Maria obter insights em **< 5 minutos**:
- Ver overview de faturamento mensal
- Identificar top 10 produtos vendidos via delivery
- Comparar performance entre lojas
- Exportar relatório para apresentar aos sócios

---

## 🏗️ Arquitetura

### Stack Tecnológico

- **Frontend & Backend:** Next.js 14+ (App Router) com TypeScript
- **Banco de Dados:** PostgreSQL (local com pgAdmin)
- **Camada de Analytics:** Cube.js Server
- **ORM:** Prisma
- **UI:** Tailwind CSS, recharts, react-grid-layout

### Arquitetura em 3 Camadas

```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Next.js)                               │
│  - Dashboards interativos                                   │
│  - Criação/edição de gráficos                              │
│  - Persistência de configurações                           │
│  Porta: 3000                                                │
└─────────────────────────────────────────────────────────────┘
                            ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│  ANALYTICS LAYER (Cube.js)                                  │
│  - 11 cubos de dados                                        │
│  - Multi-hop joins                                          │
│  - Pré-agregações                                          │
│  Porta: 4000                                                │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│  DATA LAYER (PostgreSQL)                                    │
│  - 16 tabelas                                               │
│  - 2M+ registros                                            │
│  - 6 meses de dados históricos                             │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura do Banco de Dados

**500k+ registros de vendas** com hierarquia completa:

```
Sale
├── Store + Channel + Customer (opcional)
├── ProductSales[] (1-5 produtos por venda, média 2.4)
│   ├── Product ("X-Bacon Duplo")
│   └── ItemProductSales[] (customizações: "+Bacon extra", "-Cebola")
│       ├── Item (adicional/remoção)
│       ├── OptionGroup ("Adicionais", "Remover")
│       └── ItemItemProductSales[] (nested: "Bacon + Cheddar cremoso")
├── Payments[] (1-2 métodos de pagamento)
└── DeliverySale + DeliveryAddress (se delivery)
```

**Dados Realistas:**
- 50,000 vendas
- 100,041 vendas de produtos
- 99,715 customizações (itens)
- 59,927 pagamentos
- 37,437 endereços de entrega
- Período: Maio - Outubro 2025
- Padrões temporais: picos de almoço/jantar, surges de fim de semana
- Anomalias intencionais para testes

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente
- npm ou yarn

### Instalação

```powershell
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd "God Level Coder Challenge"

# Instale dependências do Cube.js
cd cube-server
npm install

# Instale dependências do Next.js
cd ../nola-analytics
npm install

# Configure o banco de dados
# Certifique-se de que o PostgreSQL está rodando
# Edite o arquivo .env com suas credenciais

# Aplique o schema do Prisma
npx prisma db push

# (Opcional) Seed do banco com dados de teste
npx prisma db seed
```

### Executando a Aplicação

**⚠️ IMPORTANTE:** É necessário rodar em **dois terminais separados**.

#### Terminal 1: Cube.js Server (INICIAR PRIMEIRO)

```powershell
# Opção 1: Script auxiliar
.\start-cube.ps1

# Opção 2: Comando manual
cd cube-server
npm run dev
```

Aguarde a mensagem: `🚀 Cube API server is listening on 4000`

#### Terminal 2: Next.js Application (INICIAR DEPOIS)

```powershell
# Opção 1: Script auxiliar
.\start-nextjs.ps1

# Opção 2: Comando manual
cd nola-analytics
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📊 Funcionalidades

### Dashboard Principal
- Visualização de dashboards salvos
- Cards com ID, título, número de gráficos, data de criação
- Botão para criar novo dashboard

### Criação de Dashboards
- **13 medidas** organizadas em 5 categorias:
  - 💰 Vendas (receita total, ticket médio, contagem)
  - 📦 Produtos (receita, quantidade, preço médio)
  - ✨ Customizações (receita adicional, contagem)
  - 💳 Pagamentos (valor total, valor médio, contagem)
  - 🚚 Entregas (contagem, tempo médio)

- **12 dimensões** para agrupamento:
  - 🏪 Lojas, 📱 Canais, 👥 Clientes
  - 📦 Produtos, ✨ Itens (customizações)
  - 🏷️ Categorias, 💳 Tipos de Pagamento
  - 📅 Datas, 🗺️ Localização (cidade, estado, bairro)
  - ✅ Status da Venda

- **Opções Avançadas:**
  - Ordenação (por métrica ou dimensão, crescente/decrescente)
  - Limites de resultados (Top 5, 10, 15, 20, 50, todos)

- **5 tipos de visualização:**
  - 📊 Barra, 📈 Linha, 🥧 Pizza, 🔢 Número/KPI, 📋 Tabela

### Edição e Persistência
- Salvar dashboard mantém modo de edição ativo
- Banner de sucesso com detalhes do dashboard
- Adicionar novos gráficos ao dashboard existente
- Botão para criar novo dashboard limpo
- Todos os dashboards persistidos em PostgreSQL

### Validações
- Título do gráfico obrigatório
- Nome do dashboard obrigatório (no primeiro save)
- Pelo menos um gráfico no dashboard
- Notificações de sucesso/erro

---

## 🛠️ Comandos Úteis

### Gerenciamento do Banco de Dados

```powershell
cd nola-analytics

# Aplicar mudanças do schema
npx prisma db push

# Reset completo (⚠️ deleta todos os dados)
npx prisma db push --force-reset

# Abrir Prisma Studio (editor visual)
npx prisma studio

# Gerar Prisma Client após mudanças no schema
npx prisma generate
```

### Desenvolvimento

```powershell
cd nola-analytics

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Build de produção
npm run build

# Executar produção
npm start
```

### Troubleshooting de Portas

```powershell
# Matar processo na porta 4000 (Cube.js)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force

# Matar processo na porta 3000 (Next.js)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

---

## 📁 Estrutura do Projeto

```
God Level Coder Challenge/
├── cube-server/                    # Servidor Cube.js
│   ├── model/                      # 11 cubos de dados
│   │   ├── Sales.js
│   │   ├── ProductSales.js
│   │   ├── ItemProductSales.js
│   │   ├── Payments.js
│   │   ├── DeliveryAddresses.js
│   │   ├── Products.js
│   │   ├── Items.js
│   │   ├── Channels.js
│   │   ├── Stores.js
│   │   ├── Customers.js
│   │   └── PaymentTypes.js
│   ├── cube.js                     # Configuração do Cube.js
│   └── package.json
│
├── nola-analytics/                 # Aplicação Next.js
│   ├── app/                        # App Router
│   │   ├── page.tsx                # Dashboard principal
│   │   ├── new/page.tsx            # Criar/editar dashboard
│   │   ├── layout.tsx              # Layout global
│   │   └── api/                    # API Routes
│   │       └── dashboards/         # CRUD de dashboards
│   ├── components/                 # Componentes React
│   │   ├── Chart.tsx               # Renderização de gráficos
│   │   ├── DashboardGrid.tsx       # Grid layout
│   │   └── ui/                     # Componentes UI
│   ├── hooks/                      # Custom hooks
│   │   └── useNotification.ts
│   ├── lib/                        # Utilitários
│   │   ├── cubejs.ts               # Cliente Cube.js
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── prisma.ts
│   ├── services/                   # Serviços
│   │   └── dashboardService.ts
│   ├── prisma/                     # Prisma ORM
│   │   ├── schema.prisma           # Schema do banco
│   │   └── seed.ts                 # Seed de dados
│   └── package.json
│
├── start-cube.ps1                  # Script PowerShell (Cube.js)
├── start-nextjs.ps1                # Script PowerShell (Next.js)
├── WARP.md                         # Guia para instâncias futuras do Warp
└── README.md                       # Este arquivo
```

---

## 🎨 Diferenciais

### Métricas Específicas para Restaurantes
- **Ticket Médio** (avg sale amount)
- **Tempo de Entrega** (delivery seconds → minutes)
- **Mix de Produtos** (product distribution)
- **Análise por Canal** (iFood vs Rappi vs presencial)
- **Customizações mais rentáveis** (add-ons revenue)

### Padrões Operacionais
- Picos de horário (almoço: 12h-14h, jantar: 19h-22h)
- Padrões semanais (queda terça/quarta, surge sexta/sábado)
- Análise de regiões de entrega (bairro, cidade)
- Performance por loja

### Multi-hop Joins
Sistema permite **qualquer combinação** de medida + dimensão através de joins indiretos:
- `ProductSales.totalRevenue` + `Channels.name` ✅
- `ItemProductSales.count` + `Stores.name` ✅
- `Payments.count` + `Channels.name` ✅
- `DeliveryAddresses.count` + `Stores.name` ✅

---

## 🧪 Qualidade de Código

### Verificações Automáticas

```powershell
# TypeScript - sem erros
npx tsc --noEmit

# ESLint - código limpo
npm run lint

# Build de produção - sem warnings
npm run build
```

### Padrões de Qualidade
- ✅ TypeScript estrito
- ✅ Props tipadas
- ✅ Sem uso de `any` (exceto quando necessário)
- ✅ Validações de entrada
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Responsive design

---

## 📝 Notas Técnicas

### Cube.js
- **Multi-hop joins** habilitam relacionamentos indiretos através de tabelas intermediárias
- Joins configurados para permitir agregações complexas
- Todos os campos camelCase em SQL requerem aspas duplas (ex: `"storeId"`)

### Next.js
- **App Router** (não Pages Router)
- Server Components por padrão
- Client Components com `'use client'`
- API Routes em `app/api/`

### PostgreSQL
- Banco local recomendado
- Connection string em `.env`
- Schema gerenciado pelo Prisma
- Seed disponível para dados de teste

### Fluxo de Dados Crítico
```
User → Next.js (3000) → Cube.js API (4000) → PostgreSQL → Results → Charts
```
**⚠️ Cube.js DEVE estar rodando antes do Next.js**

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to Cube.js"
- Verifique se o Cube.js está rodando na porta 4000
- Confirme que o Terminal 1 exibe `🚀 Cube API server is listening on 4000`
- Reinicie o servidor Cube.js

### Erro: "coluna sales.productId não existe"
- Este erro foi corrigido na versão atual
- Sales NÃO tem `productId` direto (usa junction table `product_sales`)
- Se aparecer, verifique o arquivo `cube-server/model/Sales.js`

### Dashboards não salvam
- Verifique conexão com PostgreSQL
- Confirme que o Prisma Client está gerado: `npx prisma generate`
- Verifique logs do console no navegador

### Gráficos não carregam
- Abra DevTools (F12) e verifique Network tab
- Confirme chamadas para `http://localhost:4000/cubejs-api/v1`
- Verifique se o Cube.js está respondendo

### Porta já em uso
```powershell
# Identificar processo
Get-NetTCPConnection -LocalPort 3000

# Matar processo
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

---

## 👥 Contribuindo

Este projeto foi desenvolvido para o **God Level Coder Challenge**. Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto foi criado para fins educacionais como parte do God Level Coder Challenge.

---

## 🙏 Agradecimentos

- Desafio proposto por **God Level Coder**
- Baseado em necessidades reais de donos de restaurantes no Brasil
- Dados sintéticos gerados para simular 6 meses de operação

---

**Desenvolvido com ❤️ para ajudar Maria e 10.000+ donos de restaurantes no Brasil a tomarem decisões baseadas em dados.**
