import cubejs from '@cubejs-client/core';

// Initialize Cube.js client with environment variables
export const cubeApi = cubejs(
  process.env.NEXT_PUBLIC_CUBEJS_API_SECRET || 'mysecrettoken',
  {
    apiUrl: process.env.NEXT_PUBLIC_CUBEJS_API_URL || 'http://localhost:4000/cubejs-api/v1',
  }
);

// Types for Cube.js queries
export interface CubeMeasure {
  name: string;
  title: string;
  type: 'number' | 'string' | 'time';
}

export interface CubeDimension {
  name: string;
  title: string;
  type: 'string' | 'number' | 'time';
}

// Using any for query type to avoid deep type conflicts with Cube.js Query types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CubeQuery = any;

export type ChartType = 'line' | 'bar' | 'pie' | 'number' | 'table';

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any; // Using any to avoid deep type conflicts with Cube.js complex Query types
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
