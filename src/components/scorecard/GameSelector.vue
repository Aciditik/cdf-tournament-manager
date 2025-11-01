<template>
  <div class="bg-white p-5 rounded-[10px] mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
    <div class="flex gap-[15px] items-center justify-center flex-wrap">
      <label for="gameSelect" class="font-bold text-[#333]">Choisissez votre table:</label>
      <select v-model="selectedGameId" id="gameSelect" :disabled="loading" class="py-2.5 px-[15px] border-2 border-primary rounded-[5px] text-base min-w-[200px]">
        <option value="">-- Choisir une table --</option>
        <option 
          v-for="game in sortedGames" 
          :key="game.id" 
          :value="game.id"
        >
          {{ game.name }}
        </option>
      </select>
      <button 
        @click="loadGame" 
        :disabled="!selectedGameId || loading"
        class="py-2.5 px-[30px] bg-gradient-to-br from-primary to-primary-dark text-white border-none rounded-[5px] text-base cursor-pointer transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Loading...' : 'Load Scorecard' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const sortedGames = computed(() => {
  return [...props.games].sort((a, b) => {
    const tableA = a.tableNumber || 0
    const tableB = b.tableNumber || 0
    return tableA - tableB
  })
})

function loadGame() {
  if (selectedGameId.value) {
    emit('load-scorecard', parseInt(selectedGameId.value))
  }
}

function getPlayerNames(game) {
  if (!game.players || game.players.length === 0) {
    return '(Empty)'
  }
  return game.players.map(p => p.name).join(', ')
}
</script>