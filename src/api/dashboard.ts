import api from './axios'

export const dashboardApi = {
  get: (buildingId?: string) =>
    api.get('/Dashboard', { params: buildingId ? { buildingId } : {} }),
}
