<template>
  <div class="bg-white p-5 rounded-[10px] mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
    <div class="flex gap-[15px] items-center justify-center flex-wrap">
      <label for="gameSelect" class="font-bold text-[#333]">Select Your Game:</label>
      <select v-model="selectedGameId" id="gameSelect" :disabled="loading" class="py-2.5 px-[15px] border-2 border-primary rounded-[5px] text-base min-w-[200px]">
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