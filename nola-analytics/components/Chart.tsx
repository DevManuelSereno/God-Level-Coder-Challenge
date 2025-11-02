'use client';

import { useCubeQuery } from '@cubejs-client/react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cubeApi, ChartConfig } from '@/lib/cubejs';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber, convertDeliveryTime } from '@/lib/formatters';
import { Loading } from '@/components/ui/Loading';

interface ChartProps {
  config: ChartConfig;
}

export default function Chart({ config }: ChartProps) {
  const { resultSet, isLoading, error } = useCubeQuery(config.query, {
    cubeApi,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <p>Erro ao carregar gráfico: {error.toString()}</p>
      </div>
    );
  }

  if (!resultSet) {
    return <div className="flex items-center justify-center h-full">Nenhum dado disponível</div>;
  }

  const data = resultSet.tablePivot();
  
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Nenhum dado disponível</div>;
  }

  // Number/KPI display
  if (config.type === 'number') {
    const rawValue = data[0] ? Object.values(data[0])[0] : 0;
    let numericValue = typeof rawValue === 'string' ? parseFloat(rawValue) : (typeof rawValue === 'number' ? rawValue : 0);
    
    // Convert delivery time from seconds to minutes if needed
    if (config.id === 'avg-delivery-time' && typeof numericValue === 'number' && numericValue > 100) {
      numericValue = convertDeliveryTime(numericValue);
    }
    
    const formattedValue = formatNumber(numericValue);
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl md:text-4xl font-bold text-blue-600">{formattedValue}</div>
        <div className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">{config.title}</div>
      </div>
    );
  }

  // Table display
  if (config.type === 'table') {
    const columns = resultSet.tableColumns();
    return (
      <div className="overflow-auto" style={{ maxHeight: '100%', height: '100%' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Chart rendering
  // Pie chart needs to be outside ResponsiveContainer
  if (config.type === 'pie') {
    return (
      <div className="flex items-center justify-center h-full w-full" style={{ minHeight: '300px' }}>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            dataKey={Object.keys(data[0] || {})[1]}
            nameKey={Object.keys(data[0] || {})[0]}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        {config.type === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={Object.keys(data[0] || {})[0]} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {Object.keys(data[0] || {}).slice(1).map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2} />
            ))}
          </LineChart>
        )}
        {config.type === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={Object.keys(data[0] || {})[0]} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {Object.keys(data[0] || {}).slice(1).map((key, index) => (
              <Bar key={key} dataKey={key} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
