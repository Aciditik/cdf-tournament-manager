<template>
  <div class="registration-page">
    <div class="container">
      <h1>🎮 Player Registration</h1>
      <p>Enter your name to join the game</p>

      <div v-if="message" :class="['message', message.type]">
        {{ message.text }}
      </div>

      <div class="registration-form">
        <input 
          type="text" 
          v-model="playerName" 
          placeholder="Enter your name" 
          maxlength="50"
          @keyup.enter="registerPlayer"
        >
        <button @click="registerPlayer" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register Player' }}
        </button>
      </div>

      <div class="divider"><span>OR</span></div>

      <p style="font-size: 14px; color: #666;">Scan QR code to view scorecard</p>
      <div id="qrcode" ref="qrcodeContainer"></div>
      
      <div class="instructions">
        <strong>Instructions:</strong><br>
        1. Enter your name above and click Register<br>
        2. Scan the QR code with your phone<br>
        3. Enter scores after your game
      </div>

      <div class="admin-link">
        <router-link to="/login">🔐 Admin Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import QRCode from 'qrcode'

const gameStore = useGameStore()

const playerName = ref('')
const loading = ref(false)
const message = ref(null)
const qrcodeContainer = ref(null)

async function registerPlayer() {
  if (!playerName.value.trim()) {
    showMessage('Please enter your name', 'error')
    return
  }

  loading.value = true
  try {
    await gameStore.registerPlayer(playerName.value)
    showMessage(`✅ Welcome ${playerName.value}!`, 'success')
    playerName.value = ''
  } catch (error) {
    showMessage('❌ Registration failed: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

function showMessage(text, type) {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 4000)
}

onMounted(() => {
  // Generate QR code for scorecard page
  const scorecardUrl = 'https://aciditik.github.io/cdf-tournament-manager/scorecard'
  
  // Create canvas element
  const canvas = document.createElement('canvas')
  qrcodeContainer.value.appendChild(canvas)
  
  QRCode.toCanvas(canvas, scorecardUrl, {
    width: 180,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  })
})
</script>

<style scoped>
.registration-page {
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

.registration-form {
  margin-bottom: 30px;
}

.registration-form input {
  width: 100%;
  padding: 12px;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.registration-form input:focus {
  outline: none;
  border-color: #764ba2;
}

.registration-form button {
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

.registration-form button:hover {
  transform: scale(1.02);
}

.registration-form button:disabled {
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

.divider {
  margin: 30px 0;
  position: relative;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #ddd;
}

.divider span {
  background: white;
  padding: 0 15px;
  position: relative;
  color: #999;
  font-size: 14px;
}

#qrcode {
  display: inline-block;
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.instructions {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  text-align: left;
  margin-top: 20px;
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