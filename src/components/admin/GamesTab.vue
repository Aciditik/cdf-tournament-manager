<template>
  <div class="bg-white p-5 rounded-b-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
    <div class="flex gap-2.5 mb-5 flex-wrap">
      <button class="py-2.5 px-5 bg-primary text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#5568d3]" @click="autoAssignGames">🎲 Auto-Assign Games</button>
      <button class="py-2.5 px-5 bg-primary text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#5568d3]" @click="addNewGame">➕ Add Game</button>
      <button class="py-2.5 px-5 bg-[#dc3545] text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#c82333]" @click="clearAllGames">🗑️ Clear All Games</button>
    </div>

    <!-- Unassigned Players -->
    <div class="bg-[#fff3cd] border-2 border-[#ffc107] rounded-[10px] p-5 mb-5" v-if="gameStore.unassignedPlayers.length > 0">
      <div class="text-base font-bold text-[#856404] mb-[15px]">
        📋 Unassigned Players ({{ gameStore.unassignedPlayers.length }})
      </div>
      <div class="flex flex-wrap gap-2.5">
        <div 
          v-for="player in gameStore.unassignedPlayers" 
          :key="player.id"
          class="bg-white py-2 px-[15px] rounded-[20px] border-2 border-[#ffc107] cursor-move select-none transition-transform hover:scale-105 active:opacity-50"
          draggable="true"
          @dragstart="startDrag(player)"
        >
          {{ player.name }}
        </div>
      </div>
    </div>

    <!-- Games Grid -->
    <div v-if="gameStore.games.length === 0" class="text-center py-[60px] px-5 text-[#999]">
      <p>No games created yet. Click "Auto-Assign Games" or "Add Game" to start.</p>
    </div>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
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