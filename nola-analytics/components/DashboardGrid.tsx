'use client';

import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import Chart from './Chart';
import { ChartConfig } from '@/lib/cubejs';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  charts: ChartConfig[];
  onLayoutChange?: (layout: Layout[]) => void;
  editable?: boolean;
}

export default function DashboardGrid({ charts, onLayoutChange, editable = false }: DashboardGridProps) {

  // Generate layouts for different breakpoints
  const generateLayouts = (): Layouts => {
    const layouts: Layouts = {
      lg: charts.map((chart) => ({
        i: chart.id,
        x: chart.layout.x,
        y: chart.layout.y,
        w: chart.layout.w,
        h: chart.layout.h,
      })),
      md: charts.map((chart, index) => ({
        i: chart.id,
        x: (index % 2) * 6,
        y: Math.floor(index / 2) * 4,
        w: 6,
        h: chart.type === 'number' ? 2 : 4,
      })),
      sm: charts.map((chart, index) => ({
        i: chart.id,
        x: 0,
        y: index * 4,
        w: 6,
        h: chart.type === 'number' ? 2 : 4,
      })),
      xs: charts.map((chart, index) => ({
        i: chart.id,
        x: 0,
        y: index * 3,
        w: 4,
        h: chart.type === 'number' ? 2 : 3,
      })),
    };
    return layouts;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLayoutChange = (currentLayout: Layout[], _allLayouts: Layouts) => {
    if (onLayoutChange) {
      onLayoutChange(currentLayout);
    }
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={generateLayouts()}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
      rowHeight={60}
      onLayoutChange={handleLayoutChange}
      isDraggable={editable}
      isResizable={editable}
      compactType="vertical"
      preventCollision={false}
    >
      {charts.map((chart) => (
        <div key={chart.id} className="bg-white rounded-lg shadow-md p-3 md:p-4 flex flex-col overflow-hidden">
          <h3 className="text-sm md:text-lg font-semibold mb-2 text-gray-800 truncate shrink-0">{chart.title}</h3>
          <div className="flex-1" style={{ height: chart.type === 'number' ? '80px' : '250px', overflow: 'hidden' }}>
            <Chart config={chart} />
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
