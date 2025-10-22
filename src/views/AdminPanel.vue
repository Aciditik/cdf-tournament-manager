<template>
  <div class="admin-panel">
    <div class="admin-container">
      <div class="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>

      <div v-if="message" :class="['message', message.type]">
        {{ message.text }}
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Players</h3>
          <p>{{ gameStore.totalPlayers }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Games</h3>
          <p>{{ gameStore.totalGames }}</p>
        </div>
        <div class="stat-card">
          <h3>Unassigned</h3>
          <p>{{ gameStore.unassignedCount }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'players' }]" 
          @click="activeTab = 'players'"
        >
          👥 All Players
        </button>
        <button 
          :class="['tab', { active: activeTab === 'games' }]" 
          @click="activeTab = 'games'"
        >
          🎮 Game Management
        </button>
        <button 
          :class="['tab', { active: activeTab === 'scorecards' }]" 
          @click="activeTab = 'scorecards'"
        >
          🏆 Scorecards & Rankings
        </button>
      </div>

      <!-- Tab Content -->
      <PlayersTab v-if="activeTab === 'players'" @message="showMessage" />
      <GamesTab v-if="activeTab === 'games'" @message="showMessage" />
      <ScorecardsTab v-if="activeTab === 'scorecards'" @message="showMessage" />
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
})
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.admin-header h1 {
  color: #333;
  font-size: 28px;
  margin: 0;
}

.logout-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c82333;
}

.message {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-card p {
  color: #667eea;
  font-size: 36px;
  font-weight: bold;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
  background: white;
  padding: 0 20px;
  border-radius: 10px 10px 0 0;
}

.tab {
  padding: 15px 25px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #666;
  transition: all 0.3s;
}

.tab:hover {
  color: #667eea;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}
</style>
