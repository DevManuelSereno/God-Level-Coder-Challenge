'use client';

import { useState } from 'react';
import { CubeProvider } from '@cubejs-client/react';
import { cubeApi, ChartConfig, ChartType } from '@/lib/cubejs';
import DashboardGrid from '@/components/DashboardGrid';
import Link from 'next/link';
import { dashboardService, Dashboard } from '@/services/dashboardService';
import { useNotification } from '@/hooks/useNotification';

export default function DashboardBuilderPage() {
  const { notify } = useNotification();
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [dashboardName, setDashboardName] = useState('');
  const [showAddChart, setShowAddChart] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedDashboard, setSavedDashboard] = useState<Dashboard | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  // Form state for new chart
  const [newChart, setNewChart] = useState({
    title: '',
    type: 'bar' as ChartType,
    measure: 'Sales.totalAmount',
    dimension: 'Channels.name',
    orderBy: '',
    limit: 10,
  });

  const addChart = () => {
    // Validation
    if (!newChart.title.trim()) {
      notify({ message: 'Por favor, insira um título para o gráfico', type: 'warning' });
      return;
    }

    // Build query object
    const query: Record<string, unknown> = {
      measures: [newChart.measure],
    };

    // Add dimension if not a number/KPI chart
    if (newChart.type !== 'number' && newChart.dimension) {
      query.dimensions = [newChart.dimension];
    }

    // Add ordering if specified
    if (newChart.orderBy && newChart.dimension) {
      query.order = { [newChart.orderBy]: 'desc' };
    }

    // Add limit for table/bar/pie charts
    if (['table', 'bar', 'pie'].includes(newChart.type) && newChart.limit > 0) {
      query.limit = newChart.limit;
    }

    const chartConfig: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: newChart.type,
      title: newChart.title,
      query,
      layout: {
        x: 0,
        y: charts.length * 4,
        w: newChart.type === 'number' ? 3 : newChart.type === 'table' ? 12 : 6,
        h: newChart.type === 'number' ? 2 : newChart.type === 'table' ? 6 : 4,
      },
    };

    setCharts([...charts, chartConfig]);
    setShowAddChart(false);
    
    // Reset form
    setNewChart({
      title: '',
      type: 'bar',
      measure: 'Sales.totalAmount',
      dimension: 'Channels.name',
      orderBy: '',
      limit: 10,
    });
    
    notify({ message: 'Gráfico adicionado!', type: 'success' });
  };

  const removeChart = (id: string) => {
    setCharts(charts.filter(c => c.id !== id));
  };

  const saveDashboard = async () => {
    if (!dashboardName.trim()) {
      notify({ message: 'Por favor, insira um nome para o dashboard', type: 'warning' });
      return;
    }

    if (charts.length === 0) {
      notify({ message: 'Adicione pelo menos um gráfico ao dashboard', type: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const dashboard = await dashboardService.create({
        name: dashboardName,
        description: `Dashboard personalizado com ${charts.length} gráficos`,
        config: { charts },
      });

      notify({ message: 'Dashboard salvo com sucesso! 🎉', type: 'success' });
      
      // Keep the dashboard in state but stay in edit mode
      setSavedDashboard(dashboard);
      // setIsEditing(false); // REMOVED - stay in edit mode
    } catch (error) {
      console.error('Error saving dashboard:', error);
      notify({ message: 'Erro ao salvar dashboard', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const createNewDashboard = () => {
    setCharts([]);
    setDashboardName('');
    setSavedDashboard(null);
    setIsEditing(true);
    setShowAddChart(false);
  };

  const editDashboard = () => {
    setIsEditing(true);
  };

  // If dashboard is saved and not editing, show the saved dashboard view
  if (savedDashboard && !isEditing) {
    return (
      <CubeProvider cubeApi={cubeApi}>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">
                  Nola Analytics
                </Link>
                <p className="text-xs md:text-sm text-gray-600">Dashboard Salvo</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={editDashboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={createNewDashboard}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  + Novo Dashboard
                </button>
                <Link
                  href="/"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
                >
                  🏠 Voltar ao Início
                </Link>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
            {/* Success banner */}
            <div className="mb-4 md:mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <h3 className="text-green-800 font-semibold text-base md:text-lg">
                    Dashboard salvo com sucesso!
                  </h3>
                  <p className="text-green-700 text-xs md:text-sm mt-1">
                    ID: {savedDashboard.id} • {charts.length} gráfico(s) • Criado em {new Date(savedDashboard.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard info */}
            <div className="mb-4 md:mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {savedDashboard.name}
              </h2>
              {savedDashboard.description && (
                <p className="text-sm md:text-base text-gray-600">
                  {savedDashboard.description}
                </p>
              )}
            </div>

            {/* Dashboard content */}
            <DashboardGrid charts={charts} editable={false} />
          </main>
        </div>
      </CubeProvider>
    );
  }

  // Editing mode
  return (
    <CubeProvider cubeApi={cubeApi}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">
                Nola Analytics
              </Link>
              <p className="text-xs md:text-sm text-gray-600">
                {savedDashboard ? 'Editando Dashboard' : 'Criador de Dashboards'}
              </p>
            </div>
            <div className="flex gap-2 md:gap-3">
              {savedDashboard && (
                <button
                  onClick={createNewDashboard}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm transition-colors"
                >
                  + Novo Dashboard
                </button>
              )}
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 md:px-4 py-2 rounded-md text-xs md:text-sm transition-colors"
              >
                {savedDashboard ? '🏠 Início' : 'Cancelar'}
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
          {/* Success message when dashboard is saved */}
          {savedDashboard && (
            <div className="mb-4 md:mb-6 bg-green-50 border-l-4 border-green-500 p-3 md:p-4 rounded-md">
              <div className="flex items-start">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">✅</span>
                <div className="flex-1">
                  <h3 className="text-green-800 font-semibold text-sm md:text-base">
                    Dashboard salvo com sucesso!
                  </h3>
                  <p className="text-green-700 text-xs md:text-sm mt-1">
                    <strong>{savedDashboard.name}</strong> • ID: {savedDashboard.id.substring(0, 8)}... • {charts.length} gráfico(s)
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    Criado em {new Date(savedDashboard.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => setSavedDashboard(null)}
                  className="text-green-700 hover:text-green-900 font-bold text-lg ml-2"
                  title="Dispensar"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Name */}
          <div className="mb-4 md:mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Nome do Dashboard
            </label>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base text-gray-900 placeholder:text-gray-500"
              placeholder="Digite o nome do dashboard..."
            />
          </div>

          {/* Toolbar */}
          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-2 md:gap-3">
            <button
              onClick={() => setShowAddChart(!showAddChart)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-md text-sm md:text-base font-semibold transition-colors"
            >
              + Adicionar Gráfico
            </button>
            <button
              onClick={saveDashboard}
              disabled={saving || charts.length === 0 || !dashboardName.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-md text-sm md:text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Dashboard'}
            </button>
          </div>

          {/* Add Chart Form */}
          {showAddChart && (
            <div className="mb-4 md:mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h3 className="text-base text-gray-700 md:text-lg font-semibold">Adicionar Novo Gráfico</h3>
                <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  💡 Dica: Teste no Cube Playground primeiro
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Gráfico
                  </label>
                  <input
                    type="text"
                    value={newChart.title}
                    onChange={(e) => setNewChart({ ...newChart, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ex: Receita por Canal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Gráfico
                  </label>
                  <select
                    value={newChart.type}
                    onChange={(e) => setNewChart({ ...newChart, type: e.target.value as ChartType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bar" className="text-gray-900">Gráfico de Barras</option>
                    <option value="line" className="text-gray-900">Gráfico de Linhas</option>
                    <option value="pie" className="text-gray-900">Gráfico de Pizza</option>
                    <option value="number" className="text-gray-900">Número KPI</option>
                    <option value="table" className="text-gray-900">Tabela</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Métrica (O que calcular)
                  </label>
                  <select
                    value={newChart.measure}
                    onChange={(e) => setNewChart({ ...newChart, measure: e.target.value, orderBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <optgroup label="Vendas" className="text-gray-900">
                      <option value="Sales.totalAmount">💰 Receita Total</option>
                      <option value="Sales.count">📦 Total de Pedidos</option>
                      <option value="Sales.avgAmount">💵 Ticket Médio</option>
                      <option value="Sales.avgDeliveryTime">⏱️ Tempo Médio de Entrega</option>
                    </optgroup>
                    <optgroup label="Produtos" className="text-gray-900">
                      <option value="ProductSales.count">📦 Produtos Vendidos</option>
                      <option value="ProductSales.totalRevenue">💰 Receita de Produtos</option>
                      <option value="ProductSales.totalQuantity">🔢 Quantidade Total</option>
                      <option value="ProductSales.avgPrice">💵 Preço Médio</option>
                    </optgroup>
                    <optgroup label="Customizações" className="text-gray-900">
                      <option value="ItemProductSales.count">➕ Total de Customizações</option>
                      <option value="ItemProductSales.totalAdditionalRevenue">💰 Receita de Adicionais</option>
                    </optgroup>
                    <optgroup label="Pagamentos" className="text-gray-900">
                      <option value="Payments.count">💳 Total de Pagamentos</option>
                      <option value="Payments.totalValue">💰 Valor Total Pago</option>
                    </optgroup>
                    <optgroup label="Entregas" className="text-gray-900">
                      <option value="DeliveryAddresses.count">🚚 Total de Entregas</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensão (Como agrupar)
                  </label>
                  <select
                    value={newChart.dimension}
                    onChange={(e) => setNewChart({ ...newChart, dimension: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={newChart.type === 'number'}
                  >
                    <option value="">Nenhuma (Somente total)</option>
                    <optgroup label="Canais & Lojas">
                      <option value="Channels.name">📱 Por Canal (iFood, Rappi, etc)</option>
                      <option value="Stores.name">🏪 Por Loja</option>
                      <option value="Stores.city">🏙️ Por Cidade</option>
                    </optgroup>
                    <optgroup label="Produtos">
                      <option value="Products.name">🍔 Por Produto</option>
                      <option value="Items.name">➕ Por Item/Adicional</option>
                    </optgroup>
                    <optgroup label="Pagamentos">
                      <option value="PaymentTypes.description">💳 Por Tipo de Pagamento</option>
                    </optgroup>
                    <optgroup label="Entregas">
                      <option value="DeliveryAddresses.neighborhood">📍 Por Bairro</option>
                      <option value="DeliveryAddresses.city">🏙️ Por Cidade (Delivery)</option>
                    </optgroup>
                  </select>
                  {newChart.type === 'number' && (
                    <p className="text-xs text-gray-500 mt-1">Gráficos KPI não usam dimensões</p>
                  )}
                </div>
              </div>

              {/* Advanced options */}
              {newChart.type !== 'number' && newChart.dimension && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={newChart.orderBy}
                      onChange={(e) => setNewChart({ ...newChart, orderBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Padrão (crescente)</option>
                      <option value={newChart.measure}>Ordenar por métrica (maior → menor)</option>
                      <option value={newChart.dimension}>Ordenar por dimensão (A → Z)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limite de resultados
                    </label>
                    <select
                      value={newChart.limit}
                      onChange={(e) => setNewChart({ ...newChart, limit: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="5">Top 5</option>
                      <option value="10">Top 10</option>
                      <option value="15">Top 15</option>
                      <option value="20">Top 20</option>
                      <option value="50">Top 50</option>
                      <option value="0">Todos</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-col sm:flex-row gap-2 md:gap-3">
                <button
                  onClick={addChart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm md:text-base"
                >
                  Adicionar Gráfico
                </button>
                <button
                  onClick={() => setShowAddChart(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Chart List */}
          {charts.length > 0 && (
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg text-gray-700 font-semibold mb-2">Gráficos ({charts.length})</h3>
              <div className="flex flex-wrap gap-2">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className="bg-white px-3 md:px-4 py-2 rounded-md shadow-sm flex items-center gap-2"
                  >
                    <span className="text-xs md:text-sm truncate text-gray-700 max-w-[150px] md:max-w-none">{chart.title}</span>
                    <button
                      onClick={() => removeChart(chart.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard Preview */}
          {charts.length > 0 ? (
            <div>
              <h3 className="text-base md:text-lg text-gray-700 font-semibold mb-3 md:mb-4">Prévia</h3>
              <DashboardGrid charts={charts} editable={true} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 md:p-12 text-center">
              <p className="text-gray-500 text-sm md:text-lg">
                Nenhum gráfico ainda. Clique em &quot;Adicionar Gráfico&quot; para começar!
              </p>
            </div>
          )}
        </main>
      </div>
    </CubeProvider>
  );
}
