<template>
  <div class="min-h-screen bg-[#f5f5f5] p-5">
    <div class="max-w-[1200px] mx-auto">
      <div class="flex justify-between items-center bg-white py-5 px-[30px] rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] mb-5">
        <h1 class="text-[#333] text-[28px] m-0">⚙️ Admin Panel</h1>
        <button class="px-5 py-2.5 bg-[#dc3545] text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#c82333]" @click="logout">Logout</button>
      </div>

      <div v-if="message" :class="[
        'p-3 rounded-lg mb-5 text-sm text-center',
        message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
      ]">
        {{ message.text }}
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-5">
        <div class="bg-white p-5 rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] text-center">
          <h3 class="text-[#666] text-sm mb-2.5 uppercase tracking-wider">Total Players</h3>
          <p class="text-primary text-4xl font-bold m-0">{{ gameStore.totalPlayers }}</p>
        </div>
        <div class="bg-white p-5 rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] text-center">
          <h3 class="text-[#666] text-sm mb-2.5 uppercase tracking-wider">Total Games</h3>
          <p class="text-primary text-4xl font-bold m-0">{{ gameStore.totalGames }}</p>
        </div>
        <div class="bg-white p-5 rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] text-center">
          <h3 class="text-[#666] text-sm mb-2.5 uppercase tracking-wider">Unassigned</h3>
          <p class="text-primary text-4xl font-bold m-0">{{ gameStore.unassignedCount }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2.5 mb-5 border-b-2 border-[#eee] bg-white px-5 rounded-t-[10px]">
        <button 
          :class="[
            'py-[15px] px-[25px] bg-transparent border-none border-b-[3px] border-b-transparent cursor-pointer text-base font-bold text-[#666] transition-all hover:text-primary',
            { 'text-primary border-b-primary': activeTab === 'players' }
          ]" 
          @click="activeTab = 'players'"
        >
          👥 All Players
        </button>
        <button 
          :class="[
            'py-[15px] px-[25px] bg-transparent border-none border-b-[3px] border-b-transparent cursor-pointer text-base font-bold text-[#666] transition-all hover:text-primary',
            { 'text-primary border-b-primary': activeTab === 'games' }
          ]" 
          @click="activeTab = 'games'"
        >
          🎮 Game Management
        </button>
        <button 
          :class="[
            'py-[15px] px-[25px] bg-transparent border-none border-b-[3px] border-b-transparent cursor-pointer text-base font-bold text-[#666] transition-all hover:text-primary',
            { 'text-primary border-b-primary': activeTab === 'scorecards' }
          ]" 
          @click="activeTab = 'scorecards'"
        >
          🏆 Scorecards & Rankings
        </button>
        <button 
          :class="[
            'py-[15px] px-[25px] bg-transparent border-none border-b-[3px] border-b-transparent cursor-pointer text-base font-bold text-[#666] transition-all hover:text-primary',
            { 'text-primary border-b-primary': activeTab === 'standings' }
          ]" 
          @click="activeTab = 'standings'"
        >
          📊 Swiss Standings
        </button>
        <button 
          :class="[
            'py-[15px] px-[25px] bg-transparent border-none border-b-[3px] border-b-transparent cursor-pointer text-base font-bold text-[#666] transition-all hover:text-primary',
            { 'text-primary border-b-primary': activeTab === 'rounds' }
          ]" 
          @click="activeTab = 'rounds'"
        >
          🎯 Round Management
        </button>
      </div>

      <!-- Tab Content -->
      <PlayersTab v-if="activeTab === 'players'" @message="showMessage" />
      <GamesTab v-if="activeTab === 'games'" @message="showMessage" />
      <ScorecardsTab v-if="activeTab === 'scorecards'" @message="showMessage" />
      <div v-if="activeTab === 'standings'" class="bg-white p-5 rounded-b-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <SwissStandings :standings="gameStore.swissStandings" />
      </div>
      <div v-if="activeTab === 'rounds'" class="rounded-b-[10px]">
        <RoundManagement @message="showMessage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import PlayersTab from '@/components/admin/PlayersTab.vue'
import GamesTab from '@/components/admin/GamesTab.vue'
import ScorecardsTab from '@/components/admin/ScorecardsTab.vue'
import SwissStandings from '@/components/admin/SwissStandings.vue'
import RoundManagement from '@/components/admin/RoundManagement.vue'

const router = useRouter()
const gameStore = useGameStore()

const activeTab = ref('players')
const message = ref(null)

function logout() {
  sessionStorage.removeItem('adminLoggedIn')
  router.push('/login')
}

function showMessage(text, type) {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 4000)
}

onMounted(async () => {
  try {
    await gameStore.fetchData()
  } catch (error) {
    showMessage('❌ Error loading data: ' + error.message, 'error')
  }
});
</script>
