import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        inscription: './src/pages/inscription/index.html',
        connexion: './src/pages/connexion/index.html',
        reinitialiser: './src/pages/reinitialiser/index.html',
        mailenvoye: './src/pages/mailenvoye/index.html',
        mailverifie: './src/pages/mailverifie/index.html',
        debutant: './src/pages/debutant/index.html',
        tuto: './src/pages/tuto/index.html',
        acceuil: './src/pages/acceuil/index.html'
      },
    },
  },
})
