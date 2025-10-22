<template>
  <div class="game-selector">
    <div class="selector-group">
      <label for="gameSelect">Select Your Game:</label>
      <select v-model="selectedGameId" id="gameSelect" :disabled="loading">
        <option value="">-- Choose Game --</option>
        <option 
          v-for="game in games" 
          :key="game.id" 
          :value="game.id"
        >
          {{ game.name }} ({{ game.players.length }} players)
        </option>
      </select>
      <button 
        class="btn" 
        @click="loadGame" 
        :disabled="!selectedGameId || loading"
      >
        {{ loading ? 'Loading...' : 'Load Scorecard' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  games: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['load-scorecard'])
const selectedGameId = ref('')

function loadGame() {
  if (selectedGameId.value) {
    emit('load-scorecard', parseInt(selectedGameId.value))
  }
}
</script>

<style scoped>
.game-selector {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.selector-group {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.selector-group label {
  font-weight: bold;
  color: #333;
}

.selector-group select {
  padding: 10px 15px;
  border: 2px solid #667eea;
  border-radius: 5px;
  font-size: 16px;
  min-width: 200px;
}

.btn {
  padding: 10px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>