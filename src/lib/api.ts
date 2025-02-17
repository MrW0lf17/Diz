import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Image processing endpoints
export const enhanceImage = async (imageUrl: string) => {
  const response = await api.post('/api/images/enhance', { image_url: imageUrl })
  return response.data
}

// AI endpoints
export const generateImage = async (prompt: string) => {
  const response = await api.post('/api/ai/generate', { prompt })
  return response.data
}

export const removeBackground = async (imageUrl: string) => {
  const response = await api.post('/api/ai/remove-background', { image_url: imageUrl })
  return response.data
}

// File upload helper
export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/api/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Add request interceptor to handle authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase.auth.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api 