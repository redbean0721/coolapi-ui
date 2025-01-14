import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		"host": "0.0.0.0"
	},
	define: {
		__UI_VERSION__: JSON.stringify(version)
	}
})
