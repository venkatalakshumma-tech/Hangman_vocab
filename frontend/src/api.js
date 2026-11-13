import axios from 'axios'

// Replace this with your actual live backend URL + /api
const API = axios.create({ baseURL: 'https://your-backend-name.onrender.com/api' })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default API
