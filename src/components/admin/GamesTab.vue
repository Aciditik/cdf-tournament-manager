<template>
  <div class="tab-content">
    <div class="action-buttons">
      <button class="action-btn" @click="autoAssignGames">🎲 Auto-Assign Games</button>
      <button class="action-btn" @click="addNewGame">➕ Add Game</button>
      <button class="action-btn danger" @click="clearAllGames">🗑️ Clear All Games</button>
    </div>

    <!-- Unassigned Players -->
    <div class="unassigned-players" v-if="gameStore.unassignedPlayers.length > 0">
      <div class="unassigned-title">
        📋 Unassigned Players ({{ gameStore.unassignedPlayers.length }})
      </div>
      <div class="unassigned-list">
        <div 
          v-for="player in gameStore.unassignedPlayers" 
          :key="player.id"
          class="player-chip"
          draggable="true"
          @dragstart="startDrag(player)"
        >
          {{ player.name }}
        </div>
      </div>
    </div>

    <!-- Games Grid -->
    <div v-if="gameStore.games.length === 0" class="empty-state">
      <p>No games created yet. Click "Auto-Assign Games" or "Add Game" to start.</p>
    </div>
    <div v-else class="games-container">
      <GameCard 
        v-for="game in gameStore.games" 
        :key="game.id"
        :game="game"
        @assign-player="assignPlayer"
        @remove-player="removePlayer"
        @delete-game="deleteGame"
      />
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
import GameCard from './GameCard.vue'

const emit = defineEmits(['message'])
const gameStore = useGameStore()

function startDrag(player) {
  gameStore.draggedPlayer = player
}

async function assignPlayer({ playerId, gameId }) {
  try {
    await gameStore.assignPlayerToGame(playerId, gameId)
    emit('message', '✅ Player assigned', 'success')
  } catch (error) {
    emit('message', '❌ Error assigning: ' + error.message, 'error')
  }
}

async function removePlayer(playerId) {
  try {
    await gameStore.removePlayerFromGame(playerId)
    emit('message', '✅ Player removed from game', 'success')
  } catch (error) {
    emit('message', '❌ Error removing: ' + error.message, 'error')
  }
}

async function addNewGame() {
  gameStore.addNewGame()
  emit('message', '✅ New game added', 'success')
}

async function autoAssignGames() {
  if (gameStore.players.length === 0) {
    emit('message', '❌ No players to assign', 'error')
    return
  }
  
  try {
    await gameStore.autoAssignGames()
    emit('message', '✅ Players auto-assigned to games', 'success')
  } catch (error) {
    emit('message', '❌ Error auto-assigning: ' + error.message, 'error')
  }
}

async function deleteGame(gameId) {
  if (!confirm('Are you sure you want to delete this game?')) return
  
  try {
    await gameStore.deleteGame(gameId)
    emit('message', '✅ Game deleted', 'success')
  } catch (error) {
    emit('message', '❌ Error deleting: ' + error.message, 'error')
  }
}

async function clearAllGames() {
  if (!confirm('⚠️ Are you sure you want to clear all games?')) return
  
  try {
    await gameStore.clearAllGames()
    emit('message', '✅ All games cleared', 'success')
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

.unassigned-players {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.unassigned-title {
  font-size: 16px;
  font-weight: bold;
  color: #856404;
  margin-bottom: 15px;
}

.unassigned-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.player-chip {
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  border: 2px solid #ffc107;
  cursor: move;
  user-select: none;
  transition: transform 0.2s;
}

.player-chip:hover {
  transform: scale(1.05);
}

.player-chip:active {
  opacity: 0.5;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.games-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>