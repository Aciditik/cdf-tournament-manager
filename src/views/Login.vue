<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-5">
    <div class="bg-white p-10 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center max-w-[400px] w-full">
      <h1 class="text-[#333] mb-2.5 text-2xl">🔐 Admin Login</h1>
      <p class="text-[#666] mb-5">Enter your credentials to access the admin panel</p>

      <div v-if="message" :class="[
        'p-3 rounded-lg mb-5 text-sm',
        message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
      ]">
        {{ message.text }}
      </div>

      <div class="mb-5">
        <input 
          type="text" 
          v-model="username" 
          placeholder="Username" 
          autocomplete="username"
          @keyup.enter="login"
          class="w-full p-3 border-2 border-primary rounded-lg text-base mb-[15px] box-border focus:outline-none focus:border-primary-dark"
        >
        <input 
          type="password" 
          v-model="password" 
          placeholder="Password" 
          autocomplete="current-password"
          @keyup.enter="login"
          class="w-full p-3 border-2 border-primary rounded-lg text-base mb-[15px] box-border focus:outline-none focus:border-primary-dark"
        >
        <button 
          @click="login" 
          :disabled="loading"
          class="w-full p-3 bg-gradient-to-br from-primary to-primary-dark text-white border-none rounded-lg text-base font-bold cursor-pointer transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>

      <div class="mt-5">
        <router-link to="/" class="text-primary no-underline font-bold hover:underline">← Back to Registration</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const message = ref(null)

// Admin credentials (in production, use proper authentication)
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

async function login() {
  if (!username.value || !password.value) {
    showMessage('Please enter username and password', 'error')
    return
  }

  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    if (username.value === ADMIN_USERNAME && password.value === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminLoggedIn', 'true')
      showMessage('✅ Login successful!', 'success')
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } else {
      showMessage('❌ Invalid credentials', 'error')
      loading.value = false
    }
  }, 500)
}

function showMessage(text, type) {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 4000)
}
</script>
