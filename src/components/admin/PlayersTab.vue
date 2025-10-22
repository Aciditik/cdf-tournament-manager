<template>
  <div class="tab-content">
    <div class="action-buttons">
      <button class="action-btn" @click="refreshPlayers">🔄 Refresh</button>
      <button class="action-btn" @click="exportPlayers">📥 Export JSON</button>
      <button class="action-btn danger" @click="clearAllPlayers">🗑️ Clear All</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Game</th>
          <th>Registered At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="gameStore.loading">
          <td colspan="5" style="text-align: center; padding: 30px;">Loading...</td>
        </tr>
        <tr v-else-if="gameStore.players.length === 0">
          <td colspan="5" style="text-align: center; padding: 30px; color: #999;">
            No players registered yet
          </td>
        </tr>
        <tr v-else v-for="(player, index) in sortedPlayers" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td><strong>{{ player.name }}</strong></td>
          <td>{{ getGameName(player.gameId) }}</td>
          <td>{{ formatDate(player.created_at) }}</td>
          <td>
            <button class="delete-btn" @click="deletePlayer(player.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const emit = defineEmits(['message'])
const gameStore = useGameStore()

const sortedPlayers = computed(() => {
  return [...gameStore.players].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  )
})

function getGameName(gameId) {
  if (!gameId) return 'Unassigned'
  const game = gameStore.games.find(g => g.id === gameId)
  return game ? game.name : 'Unknown'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

async function refreshPlayers() {
  try {
    await gameStore.fetchData()
    emit('message', '✅ Players refreshed', 'success')
  } catch (error) {
    emit('message', '❌ Error refreshing: ' + error.message, 'error')
  }
}

function exportPlayers() {
  const json = JSON.stringify(gameStore.players, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `players_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  emit('message', '✅ Players exported', 'success')
}

async function deletePlayer(playerId) {
  if (!confirm('Are you sure you want to delete this player?')) return
  
  try {
    await gameStore.deletePlayer(playerId)
    emit('message', '✅ Player deleted', 'success')
  } catch (error) {
    emit('message', '❌ Error deleting: ' + error.message, 'error')
  }
}

async function clearAllPlayers() {
  if (!confirm('⚠️ Are you sure you want to delete ALL players? This cannot be undone!')) return
  
  try {
    await gameStore.clearAllPlayers()
    emit('message', '✅ All players cleared', 'success')
  } catch (error) {
    emit('message', '❌ Error clearing: ' + error.message, 'error')
  }
}
</script>

<style scoped>
.tab-content {
  background: white;
  padding: 20px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #5568d3;
}

.action-btn.danger {
  background: #dc3545;
}

.action-btn.danger:hover {
  background: #c82333;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 12px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

tbody tr:hover {
  background: #f8f9fa;
}

.delete-btn {
  padding: 6px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background: #c82333;
}
</style>