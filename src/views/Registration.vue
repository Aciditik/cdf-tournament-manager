<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-5">
    <div class="bg-white p-10 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center max-w-[400px] w-full">
      <h1 class="text-[#333] mb-2.5 text-2xl">🎮 Player Registration</h1>
      <p class="text-[#666] mb-5">Enter your name to join the game</p>

      <div v-if="message" :class="[
        'p-3 rounded-lg mb-5 text-sm',
        message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
      ]">
        {{ message.text }}
      </div>

      <div class="mb-[30px]">
        <input 
          type="text" 
          v-model="playerName" 
          placeholder="Enter your name" 
          maxlength="50"
          @keyup.enter="registerPlayer"
          class="w-full p-3 border-2 border-primary rounded-lg text-base mb-[15px] box-border focus:outline-none focus:border-primary-dark"
        >
        <button 
          @click="registerPlayer" 
          :disabled="loading"
          class="w-full p-3 bg-gradient-to-br from-primary to-primary-dark text-white border-none rounded-lg text-base font-bold cursor-pointer transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Registering...' : 'Register Player' }}
        </button>
      </div>

      <div class="my-[30px] relative text-center before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-[#ddd]">
        <span class="bg-white px-[15px] relative text-[#999] text-sm">OR</span>
      </div>

      <p class="text-sm text-[#666]">Scan QR code to view scorecard</p>
      <div id="qrcode" ref="qrcodeContainer" class="inline-block my-5 p-[15px] bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"></div>
      
      <div class="bg-[#f8f9fa] p-[15px] rounded-lg text-sm text-[#666] text-left mt-5">
        <strong>Instructions:</strong><br>
        1. Enter your name above and click Register<br>
        2. Scan the QR code with your phone<br>
        3. Enter scores after your game
      </div>

      <div class="mt-5">
        <router-link to="/login" class="text-primary no-underline font-bold hover:underline">🔐 Admin Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import QRCodeStyling from 'qr-code-styling'

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
  const scorecardUrl = 'https://aciditik.github.io/cdf-tournament-manager/#/scorecard'
  
  const qrCode = new QRCodeStyling({
    data: scorecardUrl,
    width: 250,
    height: 250,
    margin: 10,
    type: 'canvas',
    image: '/cdf-tournament-manager/favicon/web-app-manifest-192x192.png',
    qrOptions: {
      errorCorrectionLevel: 'H'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
      crossOrigin: 'anonymous'
    },
    dotsOptions: {
      type: 'rounded',
      color: '#000000'
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#000000'
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#000000'
    },
    backgroundOptions: {
      color: '#ffffff'
    }
  })
  qrCode.append(qrcodeContainer.value)
})
</script>