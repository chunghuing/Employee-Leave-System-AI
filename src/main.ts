import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/main.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// 必須在 app.use(router) 之前還原登入狀態，router 安裝時會立即觸發首次導航的守衛檢查。
useAuthStore(pinia).restoreSession()

app.use(router)
app.use(ElementPlus)

void enableMocking().then(() => {
  app.mount('#app')
})
