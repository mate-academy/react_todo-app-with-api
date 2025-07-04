import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      types: path.resolve(__dirname, 'src/types'),
      utils: path.resolve(__dirname, 'src/utils'),
      constants: path.resolve(__dirname, 'src/constants'),
      helpers: path.resolve(__dirname, 'src/helpers'),
      components: path.resolve(__dirname, 'src/components'),
      api: path.resolve(__dirname, 'src/api'),
    },
  },
});
