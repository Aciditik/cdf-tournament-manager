<template>
  <div class="scorecard-page">
    <div class="container">
      <h1>🎯 Game Scorecard</h1>
      
      <div v-if="message" :class="['message', message.type]">
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
  { corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 },
  { corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 },
  { corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 },
  { corporation: 0, tr: 0, rewards: 0, objectives: 0, forests: 0, cities: 0, cards: 0 }
])

const scorecardTitle = computed(() => {
  const game = gameStore.games.find(g => g.id === selectedGameId.value)
  return game ? `${game.name.toUpperCase()} - FINAL SCORE` : ''
})

const totals = computed(() => {
  return scores.value.map(score => 
    Object.values(score).reduce((sum, val) => sum + (val || 0), 0)
  )
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
    Object.keys(score).forEach(key => score[key] = 0)
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
    { name: 'Ecoline', value: 3 },
    { name: 'Helion', value: 5 },
    { name: 'Mining Guild', value: 2 },
    { name: 'Interplanetary Cinematics', value: 4 },
    { name: 'Inventrix', value: 1 },
    { name: 'Phobolog', value: 3 },
    { name: 'Tharsis Republic', value: 2 },
    { name: 'Thorgate', value: 4 },
    { name: 'United Nations Mars Initiative', value: 5 },
    { name: 'Teractor', value: 3 },
    { name: 'Saturn Systems', value: 2 }
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

<style scoped>
.scorecard-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 15px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 15px;
  text-align: center;
  font-size: 24px;
}

.message {
  text-align: center;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: bold;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}
</style>
