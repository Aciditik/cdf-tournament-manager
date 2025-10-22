<template>
  <div :class="['game-card', { full: game.players.length >= 4 }]">
    <div class="game-header">
      <div class="game-title">{{ game.name }}</div>
      <div :class="['game-count', { full: game.players.length >= 4 }]">
        {{ game.players.length }}/4
      </div>
      <button class="delete-game-btn" @click="$emit('delete-game', game.id)" title="Delete Game">
        ✖
      </button>
    </div>

    <div class="player-slots">
      <div 
        v-for="i in 4" 
        :key="i"
        :class="['player-slot', { filled: game.players[i-1], 'drag-over': dragOver === i }]"
        @drop="handleDrop(i)"
        @dragover.prevent="dragOver = i"
        @dragleave="dragOver = null"
      >
        <template v-if="game.players[i-1]">
          <span class="player-name">{{ game.players[i-1].name }}</span>
          <button 
            class="remove-player-btn" 
            @click="$emit('remove-player', game.players[i-1].id)"
            title="Remove player"
          >
            ✖
          </button>
        </template>
        <span v-else class="empty-slot">Empty Slot {{ i }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['assign-player', 'remove-player', 'delete-game'])
const gameStore = useGameStore()
const dragOver = ref(null)

function handleDrop(slotIndex) {
  dragOver.value = null
  
  if (!gameStore.draggedPlayer) return
  
  // Check if game is full
  if (props.game.players.length >= 4) {
    alert('This game is full (4 players max)')
    return
  }
  
  // Check if player is already in this game
  const alreadyInGame = props.game.players.some(p => p.id === gameStore.draggedPlayer.id)
  if (alreadyInGame) {
    alert('Player is already in this game')
    return
  }
  
  emit('assign-player', {
    playerId: gameStore.draggedPlayer.id,
    gameId: props.game.id
  })
  
  gameStore.draggedPlayer = null
}
</script>

<style scoped>
.game-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 2px solid #ddd;
  transition: border-color 0.3s;
}

.game-card.full {
  border-color: #28a745;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.game-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.game-count {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
}

.game-count.full {
  background: #28a745;
}

.delete-game-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.delete-game-btn:hover {
  background: #c82333;
}

.player-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-slot {
  background: white;
  padding: 12px;
  border-radius: 5px;
  border: 2px dashed #ddd;
  min-height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
}

.player-slot.filled {
  border-style: solid;
  border-color: #667eea;
  background: #f0f4ff;
}

.player-slot.drag-over {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: scale(1.02);
}

.player-name {
  font-weight: 500;
  color: #333;
}

.empty-slot {
  color: #999;
  font-size: 14px;
}

.remove-player-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.remove-player-btn:hover {
  background: #c82333;
}
</style>