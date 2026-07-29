import api from './axios'

export const buildingsApi = {
  getAll: (params?: any) => api.get('/Buildings', { params }),
  getById: (id: string) => api.get(`/Buildings/${id}`),
  create: (data: any) => api.post('/Buildings', data),
  update: (id: string, data: any) => api.put(`/Buildings/${id}`, data),
  delete: (id: string) => api.delete(`/Buildings/${id}`),
}
