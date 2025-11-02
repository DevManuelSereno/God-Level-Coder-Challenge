# 🚀 Como Executar o Projeto

## ✅ Pré-requisitos
- ✅ PostgreSQL rodando (pgAdmin aberto)
- ✅ Banco "Nola" com dados (510k registros)
- ✅ Node.js instalado

## 📋 Execução - 2 Terminais

### Terminal 1: Cube.js Server

```powershell
cd C:\Users\GAMER\OneDrive\Documentos\Faculdade\nola-analytics\cube-server
npm run dev
```

**Ou use o script:**
```powershell
.\start-cube.ps1
```

✅ Aguarde até ver: `🚀 Cube API server is listening on 4000`

### Terminal 2: Next.js App

Abra um **NOVO terminal** PowerShell:

```powershell
cd C:\Users\GAMER\OneDrive\Documentos\Faculdade\nola-analytics\nola-analytics
npm run dev
```

**Ou use o script:**
```powershell
.\start-nextjs.ps1
```

## 🌐 URLs

| Serviço | URL | Descrição |
|---------|-----|-----------|
| 🏠 **Dashboard** | http://localhost:3000 | Dashboard principal com dados reais |
| ✏️ **Criar Dashboard** | http://localhost:3000/new | Builder para criar dashboards customizados |
| 🎮 **Cube Playground** | http://localhost:4000 | Testar queries Cube.js |

## 🎯 Testar o Sistema

### 1. Testar Cube.js Playground (http://localhost:4000)

**Query 1: Total Revenue**
```json
{
  "measures": ["Sales.totalAmount"]
}
```

**Query 2: Revenue por Canal**
```json
{
  "measures": ["Sales.totalAmount"],
  "dimensions": ["Channels.name"]
}
```

**Query 3: Produtos Mais Vendidos**
```json
{
  "measures": ["Sales.count", "Sales.totalAmount"],
  "dimensions": ["Products.name"],
  "order": { "Sales.totalAmount": "desc" },
  "limit": 10
}
```

### 2. Testar Dashboard (http://localhost:3000)

Você verá 6 widgets com dados reais:
- 📈 Total Revenue
- 📦 Total Orders
- ⏱️ Avg Delivery Time
- 📊 Revenue by Channel
- 📉 Orders Over Time
- 📋 Top 10 Products

### 3. Criar Dashboard Customizado (http://localhost:3000/new)

1. Digite um nome para o dashboard
2. Clique "Add Chart"
3. Configure:
   - **Title:** "Vendas por Região"
   - **Type:** Bar Chart
   - **Measure:** Total Revenue
   - **Dimension:** By Region
4. Clique "Add Chart"
5. Clique "Save Dashboard"

## 🔧 Troubleshooting

### Erro: "Can't reach database"
```powershell
# Verifique se PostgreSQL está rodando
# Abra pgAdmin e conecte ao banco Nola
```

### Erro: "Port 4000 already in use"
```powershell
# Mate o processo na porta 4000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force
```

### Erro: "Port 3000 already in use"
```powershell
# Mate o processo na porta 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### Charts não carregam
1. Verifique se Cube.js está rodando (http://localhost:4000)
2. Abra o console do navegador (F12)
3. Verifique erros de CORS ou conexão

## 📊 Dados Disponíveis

- **500.000** vendas
- **50** lojas (5 regiões)
- **100** produtos (7 categorias)
- **4** canais (In-Store, iFood, Rappi, App)
- **10.000** clientes
- **6 meses** de histórico

## 🎬 Próximos Passos

1. ✅ Testar todas as páginas
2. ✅ Criar dashboards customizados
3. ✅ Testar queries no Playground
4. ⏭️ Deploy (Neon + Cube Cloud + Vercel)
5. ⏭️ Gravar vídeo demo
6. ⏭️ Submeter projeto

---

**Dúvidas?** Veja `QUICK_START.md` ou `README.md`
