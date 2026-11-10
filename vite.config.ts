import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          const moduleId = id.replaceAll('\\', '/')

          if (moduleId.includes('commonjsHelpers.js')) return 'vendor-react'

          if (moduleId.includes('/node_modules/')) {
            if (moduleId.includes('/react-dom/') || moduleId.includes('/scheduler/')) return 'vendor-react-dom'
            if (moduleId.includes('/react/')) return 'vendor-react'
            if (moduleId.includes('/recharts/') || moduleId.includes('/react-smooth/')) return 'vendor-recharts'
            if (moduleId.includes('/d3-')) return 'vendor-d3'
            if (moduleId.includes('/@phosphor-icons/') || moduleId.includes('/lucide-react/')) return 'vendor-icons'
          }

          const screenModule = moduleId.match(/\/src\/app\/([^/]+Screens|UIKit|AdminScreens)\.tsx$/)
          if (screenModule) return `screen-${screenModule[1].toLowerCase()}`

          const standaloneScreen = moduleId.match(
            /\/src\/app\/(GuestPortal|FieldApp|PrintTemplates|PlatformAdminConsole|OrgPortalExtensions|PlatformAdminExtensions)\.tsx$/,
          )
          if (standaloneScreen) return `screen-${standaloneScreen[1].toLowerCase()}`
        },
      },
    },
  },
})
