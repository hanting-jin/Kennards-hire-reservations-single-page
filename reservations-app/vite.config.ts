import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    // 类型上与不同版本的 Vite Plugin 不兼容，这里直接断言为 any 以避免 TS 报错
    tailwindcss() as any,
  ],
})
