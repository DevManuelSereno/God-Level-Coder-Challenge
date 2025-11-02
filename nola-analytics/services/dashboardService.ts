import { ChartConfig } from '@/lib/cubejs';

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  config: {
    charts: ChartConfig[];
  };
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface CreateDashboardDto {
  name: string;
  description?: string;
  config: {
    charts: ChartConfig[];
  };
  userId?: string;
}

export interface UpdateDashboardDto {
  name?: string;
  description?: string;
  config?: {
    charts: ChartConfig[];
  };
}

/**
 * Dashboard API Service
 * Centralizes all dashboard-related API calls
 */
export const dashboardService = {
  /**
   * Fetch all dashboards
   */
  async getAll(): Promise<Dashboard[]> {
    const response = await fetch('/api/dashboards');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboards');
    }
    return response.json();
  },

  /**
   * Fetch a single dashboard by ID
   */
  async getById(id: string): Promise<Dashboard> {
    const response = await fetch(`/api/dashboards/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }
    return response.json();
  },

  /**
   * Create a new dashboard
   */
  async create(data: CreateDashboardDto): Promise<Dashboard> {
    const response = await fetch('/api/dashboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create dashboard');
    }
    return response.json();
  },

  /**
   * Update an existing dashboard
   */
  async update(id: string, data: UpdateDashboardDto): Promise<Dashboard> {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update dashboard');
    }
    return response.json();
  },

  /**
   * Delete a dashboard
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete dashboard');
    }
    return response.json();
  },
};
