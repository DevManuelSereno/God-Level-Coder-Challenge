'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CubeProvider } from '@cubejs-client/react';
import { cubeApi, ChartConfig, ChartType } from '@/lib/cubejs';
import DashboardGrid from '@/components/DashboardGrid';
import Link from 'next/link';
import { dashboardService } from '@/services/dashboardService';
import { useNotification } from '@/hooks/useNotification';

export default function DashboardBuilderPage() {
  const router = useRouter();
  const { notify } = useNotification();
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [dashboardName, setDashboardName] = useState('');
  const [showAddChart, setShowAddChart] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for new chart
  const [newChart, setNewChart] = useState({
    title: '',
    type: 'bar' as ChartType,
    measure: 'Sales.totalAmount',
    dimension: 'Channels.name',
  });

  const addChart = () => {
    const chartConfig: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: newChart.type,
      title: newChart.title || 'Gráfico Sem Título',
      query: {
        measures: [newChart.measure],
        dimensions: newChart.dimension ? [newChart.dimension] : undefined,
      },
      layout: {
        x: 0,
        y: charts.length * 4,
        w: newChart.type === 'number' ? 3 : 6,
        h: newChart.type === 'number' ? 2 : 4,
      },
    };

    setCharts([...charts, chartConfig]);
    setShowAddChart(false);
    setNewChart({
      title: '',
      type: 'bar',
      measure: 'Sales.totalAmount',
      dimension: 'Channels.name',
    });
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
      await dashboardService.create({
        name: dashboardName,
        description: `Dashboard personalizado com ${charts.length} gráficos`,
        config: { charts },
      });

      notify({ message: 'Dashboard salvo com sucesso!', type: 'success' });
      router.push('/');
    } catch (error) {
      console.error('Error saving dashboard:', error);
      notify({ message: 'Erro ao salvar dashboard', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CubeProvider cubeApi={cubeApi}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">
                Nola Analytics
              </Link>
              <p className="text-xs md:text-sm text-gray-600">Criador de Dashboards</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
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
              <h3 className="text-base text-gray-700 md:text-lg font-semibold mb-3 md:mb-4">Adicionar Novo Gráfico</h3>
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
                    onChange={(e) => setNewChart({ ...newChart, measure: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Sales.totalAmount" className="text-gray-900">Receita Total</option>
                    <option value="Sales.count" className="text-gray-900">Total de Pedidos</option>
                    <option value="Sales.avgAmount" className="text-gray-900">Valor Médio do Pedido</option>
                    <option value="Sales.avgDeliveryTime" className="text-gray-900">Tempo Médio de Entrega</option>
                    <option value="Sales.totalQuantity" className="text-gray-900">Quantidade Total</option>
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
                  >
                    <option value="" className="text-gray-900">Nenhuma (Somente total)</option>
                    <option value="Channels.name" className="text-gray-900">Por Canal</option>
                    <option value="Products.name" className="text-gray-900">Por Produto</option>
                    <option value="Products.category" className="text-gray-900">Por Categoria</option>
                    <option value="Stores.region" className="text-gray-900">Por Região</option>
                    <option value="Stores.city" className="text-gray-900">Por Cidade</option>
                    <option value="Sales.dayOfWeek" className="text-gray-900">Por Dia da Semana</option>
                    <option value="Sales.hourOfDay" className="text-gray-900">Por Hora</option>
                  </select>
                </div>
              </div>

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
              <h3 className="text-base md:text-lg font-semibold mb-2">Gráficos ({charts.length})</h3>
              <div className="flex flex-wrap gap-2">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className="bg-white px-3 md:px-4 py-2 rounded-md shadow-sm flex items-center gap-2"
                  >
                    <span className="text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{chart.title}</span>
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
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Prévia</h3>
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
