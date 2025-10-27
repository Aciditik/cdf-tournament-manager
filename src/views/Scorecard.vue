<template>
  <div class="min-h-screen bg-[#f5f5f5] p-[15px] w-full box-border">
    <div class="max-w-[900px] mx-auto w-full">
      <h1 class="text-[#333] mb-[15px] text-center text-2xl md:text-xl md:mb-2.5">🎯 Game Scorecard</h1>
      
      <div v-if="message" :class="[
        'text-center p-3 mb-5 rounded-lg font-bold',
        message.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-200' : 'bg-red-100 text-red-800 border-2 border-red-200'
      ]">
        {{ message.text }}
      </div>
      
      <!-- Game Selector -->
      <GameSelector 
        :games="gameStore.games"
        :loading="gameStore.loading"
        @load-scorecard="loadScorecard"
      />

      <!-- Score Table -->
      <ScoreTable 
        v-if="showScorecard"
        :scorecard-title="scorecardTitle"
        :player-names="playerNames"
        :scores="scores"
        :totals="totals"
        :ranks="ranks"
        @update:player-names="playerNames = $event"
        @update:scores="scores = $event"
        @calculate="calculateTotals"
        @save="saveScorecard"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import GameSelector from '@/components/scorecard/GameSelector.vue'
import ScoreTable from '@/components/scorecard/ScoreTable.vue'

const gameStore = useGameStore()

const selectedGameId = ref(null)
const showScorecard = ref(false)
const message = ref(null)

const playerNames = ref(['', '', '', ''])
const scores = ref([
  { corporationName: '', corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 },
  { corporationName: '', corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 },
  { corporationName: '', corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 },
  { corporationName: '', corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 }
])

const scorecardTitle = computed(() => {
  const game = gameStore.games.find(g => g.id === selectedGameId.value)
  return game ? `${game.name.toUpperCase()} - FINAL SCORE` : ''
})

const totals = computed(() => {
  return scores.value.map(score => {
    // Only sum numeric fields, exclude corporationName
    return (score.corporation || 0) + 
           (score.tr || 0) + 
           (score.rewards || 0) + 
           (score.objectives || 0) + 
           (score.forests || 0) + 
           (score.cities || 0) + 
           (score.cards || 0)
  })
})

const ranks = computed(() => {
  const ranked = totals.value
    .map((total, index) => ({ index, total }))
    .sort((a, b) => b.total - a.total)
  
  const rankArray = new Array(4).fill('-')
  let currentRank = 1
  let previousTotal = -1
  
  ranked.forEach((item, idx) => {
    if (item.total !== previousTotal) {
      currentRank = idx + 1
    }
    
    let rankText = currentRank
    if (currentRank === 1) rankText = '🥇 1st'
    else if (currentRank === 2) rankText = '🥈 2nd'
    else if (currentRank === 3) rankText = '🥉 3rd'
    else rankText = `${currentRank}th`
    
    rankArray[item.index] = rankText
    previousTotal = item.total
  })
  
  return rankArray
})

function loadScorecard(gameId) {
  selectedGameId.value = gameId
  const game = gameStore.games.find(g => g.id === gameId)
  
  if (!game) {
    showMessage('❌ Game not found', 'error')
    return
  }
  
  // Clear all scores
  scores.value.forEach(score => {
    score.corporationName = ''
    score.corporation = 0
    score.tr = 0
    score.rewards = 0
    score.objectives = 0
    score.forests = 0
    score.cities = 0
    score.cards = 0
  })
  playerNames.value = ['', '', '', '']
  
  // Load player names
  game.players.forEach((player, index) => {
    if (index < 4) {
      playerNames.value[index] = player.name
    }
  })
  
  showScorecard.value = true
  showMessage('✅ Scorecard loaded', 'success')
}

function calculateTotals() {
  // Triggers computed properties to recalculate
}

async function saveScorecard() {
  if (!selectedGameId.value) {
    showMessage('❌ No game selected', 'error')
    return
  }
  
  // Corporation list for name lookup
  const corporations = [
    { name: 'Credicor', value: 0 },
    { name: 'Ecoline', value: 0 },
    { name: 'Helion', value: 0 },
    { name: 'Mining Guild', value: 0 },
    { name: 'Interplanetary Cinematics', value: 0 },
    { name: 'Inventrix', value: 0 },
    { name: 'Phobolog', value: 0 },
    { name: 'Tharsis Republic', value: 0 },
    { name: 'Thorgate', value: 0 },
    { name: 'United Nations Mars Initiative', value: 0 },
    { name: 'Teractor', value: 0 },
    { name: 'Saturn Systems', value: 0 }
  ]
  
  const scorecardData = {
    gameId: selectedGameId.value,
    savedAt: new Date().toISOString(),
    players: playerNames.value.map((name, i) => {
      const playerScores = { ...scores.value[i] }
      
      // Convert corporation value to object with name and value
      const corpValue = playerScores.corporation || 0
      const corp = corporations.find(c => c.value === corpValue) || { name: 'Select Corporation', value: 0 }
      playerScores.corporation = {
        value: corp.value,
        name: corp.name
      }
      
      return {
        name,
        scores: playerScores,
        total: totals.value[i],
        rank: ranks.value[i]
      }
    })
  }
  
  try {
    await gameStore.saveScorecard(scorecardData)
    showMessage('✅ Scorecard saved successfully!', 'success')
  } catch (error) {
    showMessage('❌ Error saving: ' + error.message, 'error')
  }
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
