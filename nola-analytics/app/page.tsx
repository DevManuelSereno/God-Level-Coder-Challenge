'use client';

import { CubeProvider } from '@cubejs-client/react';
import DashboardGrid from '@/components/DashboardGrid';
import { cubeApi } from '@/lib/cubejs';
import Link from 'next/link';

// Dashboard configuration
const dashboardCharts = [
  {
    id: 'total-revenue',
    type: 'number' as const,
    title: 'Receita Total',
    query: {
      measures: ['Sales.totalAmount'],
    },
    layout: { x: 0, y: 0, w: 3, h: 2 },
  },
  {
    id: 'total-orders',
    type: 'number' as const,
    title: 'Total de Pedidos',
    query: {
      measures: ['Sales.count'],
    },
    layout: { x: 3, y: 0, w: 3, h: 2 },
  },
  {
    id: 'avg-delivery-time',
    type: 'number' as const,
    title: 'Tempo Médio de Entrega (min)',
    query: {
      measures: ['Sales.avgDeliveryTime'],
    },
    layout: { x: 6, y: 0, w: 3, h: 2 },
  },
  {
    id: 'avg-ticket',
    type: 'number' as const,
    title: 'Ticket Médio',
    query: {
      measures: ['Sales.avgAmount'],
    },
    layout: { x: 9, y: 0, w: 3, h: 2 },
  },
  {
    id: 'revenue-by-channel',
    type: 'bar' as const,
    title: 'Receita por Canal',
    query: {
      measures: ['Sales.totalAmount'],
      dimensions: ['Channels.name'],
    },
    layout: { x: 0, y: 2, w: 6, h: 4 },
  },
  {
    id: 'orders-over-time',
    type: 'line' as const,
    title: 'Pedidos ao Longo do Tempo',
    query: {
      measures: ['Sales.count'],
      timeDimensions: [
        {
          dimension: 'Sales.createdAt',
          granularity: 'day',
          dateRange: 'Last 30 days',
        },
      ],
    },
    layout: { x: 6, y: 2, w: 6, h: 4 },
  },
  {
    id: 'top-products',
    type: 'table' as const,
    title: 'Top 10 Produtos',
    query: {
      measures: ['ProductSales.totalRevenue', 'ProductSales.count'],
      dimensions: ['Products.name'],
      order: {
        'ProductSales.totalRevenue': 'desc',
      },
      limit: 10,
    },
    layout: { x: 0, y: 6, w: 12, h: 4 },
  },
  {
    id: 'customizations-revenue',
    type: 'bar' as const,
    title: 'Receita de Customizações (Top 10)',
    query: {
      measures: ['ItemProductSales.totalAdditionalRevenue'],
      dimensions: ['Items.name'],
      order: {
        'ItemProductSales.totalAdditionalRevenue': 'desc'
      },
      limit: 10
    },
    layout: { x: 0, y: 10, w: 6, h: 4 }
  },
  {
    id: 'payment-types',
    type: 'bar' as const,
    title: 'Mix de Pagamentos',
    query: {
      measures: ['Payments.count'],
      dimensions: ['PaymentTypes.description'],
      order: {
        'Payments.count': 'desc'
      }
    },
    layout: { x: 6, y: 10, w: 6, h: 4 }
  },
  {
    id: 'delivery-by-neighborhood',
    type: 'bar' as const,
    title: 'Entregas por Bairro (Top 15)',
    query: {
      measures: ['DeliveryAddresses.count', 'Sales.avgDeliveryTime'],
      dimensions: ['DeliveryAddresses.neighborhood'],
      order: {
        'DeliveryAddresses.count': 'desc'
      },
      limit: 15
    },
    layout: { x: 0, y: 14, w: 12, h: 4 }
  },
];

export default function Home() {
  return (
    <CubeProvider cubeApi={cubeApi}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-blue-600">Nola Analytics</h1>
              <p className="text-xs md:text-sm text-gray-600">Dashboard de Análise de Restaurantes</p>
            </div>
            <Link
              href="/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm transition-colors whitespace-nowrap w-full sm:w-auto text-center"
            >
              + Criar Dashboard
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
          <div className="mb-3 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Bem-vinda, Maria.</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Insights em tempo real dos seus dados de restaurante com mais de 500 mil registros de vendas.
            </p>
          </div>

          <DashboardGrid charts={dashboardCharts} editable={false} />
        </main>
      </div>
    </CubeProvider>
  );
}
