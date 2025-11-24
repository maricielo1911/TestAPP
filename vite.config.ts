import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno desde el archivo .env si existe (modo local)
  const env = loadEnv(mode, process.cwd(), '');
  
  // En Vercel/Netlify, las variables están en process.env, no siempre en loadEnv
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Inyecta la clave API en el código compilado
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})
