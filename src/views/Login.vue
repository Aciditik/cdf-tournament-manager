<template>
  <div class="login-page">
    <div class="container">
      <h1>🔐 Admin Login</h1>
      <p>Enter your credentials to access the admin panel</p>

      <div v-if="message" :class="['message', message.type]">
        {{ message.text }}
      </div>

      <div class="login-form">
        <input 
          type="text" 
          v-model="username" 
          placeholder="Username" 
          autocomplete="username"
          @keyup.enter="login"
        >
        <input 
          type="password" 
          v-model="password" 
          placeholder="Password" 
          autocomplete="current-password"
          @keyup.enter="login"
        >
        <button @click="login" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>

      <div class="admin-link">
        <router-link to="/">← Back to Registration</router-link>
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

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.login-form {
  margin-bottom: 20px;
}

.login-form input {
  width: 100%;
  padding: 12px;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.login-form input:focus {
  outline: none;
  border-color: #764ba2;
}

.login-form button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.login-form button:hover {
  transform: scale(1.02);
}

.login-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.admin-link {
  margin-top: 20px;
}

.admin-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
}

.admin-link a:hover {
  text-decoration: underline;
}
</style>
