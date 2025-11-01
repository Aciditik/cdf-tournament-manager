<template>
  <div class="bg-white p-5 rounded-b-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
    <div class="flex gap-2.5 mb-5 flex-wrap">
      <button class="py-2.5 px-5 bg-primary text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#5568d3]" @click="refreshPlayers">🔄 Refresh</button>
      <button class="py-2.5 px-5 bg-primary text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#5568d3]" @click="exportPlayers">📥 Export JSON</button>
      <button class="py-2.5 px-5 bg-[#dc3545] text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#c82333]" @click="clearAllPlayers">🗑️ Clear All</button>
    </div>

    <table class="w-full border-collapse">
      <thead class="bg-[#f8f9fa]">
        <tr>
          <th class="p-3 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">#</th>
          <th class="p-3 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Name</th>
          <th class="p-3 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Table #</th>
          <th class="p-3 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Game</th>
          <th class="p-3 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Registered At</th>
          <th class="p-3 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="gameStore.loading">
          <td colspan="6" class="text-center p-[30px]">Loading...</td>
        </tr>
        <tr v-else-if="gameStore.players.length === 0">
          <td colspan="6" class="text-center p-[30px] text-[#999]">
            No players registered yet
          </td>
        </tr>
        <tr v-else v-for="(player, index) in sortedPlayers" :key="player.id" class="hover:bg-[#f8f9fa]">
          <td class="p-3 border-b border-[#dee2e6]">{{ index + 1 }}</td>
          <td class="p-3 border-b border-[#dee2e6]"><strong>{{ player.name }}</strong></td>
          <td class="p-3 border-b border-[#dee2e6]">
            <input 
              type="number" 
              min="1" 
              :value="player.tableNumber || ''"
              @change="assignTableNumber(player.id, $event.target.value)"
              placeholder="#"
              class="w-16 p-1.5 border-2 border-[#ddd] rounded text-center focus:border-primary focus:outline-none"
            />
          </td>
          <td class="p-3 border-b border-[#dee2e6]">{{ getGameName(player.gameId) }}</td>
          <td class="p-3 border-b border-[#dee2e6]">{{ formatDate(player.created_at) }}</td>
          <td class="p-3 border-b border-[#dee2e6]">
            <button class="py-1.5 px-3 bg-[#dc3545] text-white border-none rounded cursor-pointer text-xs hover:bg-[#c82333]" @click="deletePlayer(player.id)">Delete</button>
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

async function assignTableNumber(playerId, tableNumber) {
  const tableNum = parseInt(tableNumber)
  
  if (!tableNum || tableNum < 1) {
    emit('message', '❌ Please enter a valid table number', 'error')
    return
  }
  
  try {
    await gameStore.assignPlayerToTableNumber(playerId, tableNum)
    emit('message', `✅ Player assigned to Table ${tableNum}`, 'success')
  } catch (error) {
    emit('message', '❌ Error assigning: ' + error.message, 'error')
  }
}
</script>