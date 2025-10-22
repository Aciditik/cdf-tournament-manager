<template>
  <div>
    <div class="scorecard">
      <div class="scorecard-header">{{ scorecardTitle }}</div>
      
      <table class="score-table">
        <thead>
          <tr>
            <th>Table 1</th>
            <th v-for="i in 4" :key="i" class="player-header">Joueur #{{ i }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Player Names -->
          <tr>
            <td class="category-cell">Nom du joueur</td>
            <td v-for="i in 4" :key="i">
              <input 
                type="text" 
                :value="playerNames[i-1]" 
                readonly
                class="player-name-input"
              >
            </td>
          </tr>
          
          <!-- Corporation -->
          <tr>
            <td class="category-cell">Corporation</td>
            <td v-for="i in 4" :key="i">
              <select 
                v-model="localScores[i-1].corporationName"
                @change="handleCorporationChange(i-1)"
                class="score-select"
              >
                <option value="">Select Corporation</option>
                <option 
                  v-for="corp in corporations" 
                  :key="corp.name" 
                  :value="corp.name"
                  :disabled="isCorporationSelected(corp.name, i-1)"
                >
                  {{ corp.name }}
                </option>
              </select>
            </td>
          </tr>
          
          <!-- Score Categories -->
          <tr v-for="category in scoreCategories" :key="category.key">
            <td class="category-cell">{{ category.label }}</td>
            <td v-for="i in 4" :key="i">
              <input 
                type="number" 
                v-model.number="localScores[i-1][category.key]"
                @input="handleScoreChange"
                class="score-input"
                min="0"
                value="0"
              >
            </td>
          </tr>
          
          <!-- Total Row -->
          <tr class="total-row">
            <td class="category-cell">Total</td>
            <td v-for="(total, i) in totals" :key="i">{{ total }}</td>
          </tr>
          
          <!-- Rank Row -->
          <tr class="rank-row">
            <td class="category-cell">Classement</td>
            <td v-for="(rank, i) in ranks" :key="i">{{ rank }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="save-section">
      <button class="btn" @click="handleSave">💾 Save Scores</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  scorecardTitle: String,
  playerNames: Array,
  scores: Array,
  totals: Array,
  ranks: Array
})

const emit = defineEmits(['update:scores', 'calculate', 'save'])

const localScores = ref(JSON.parse(JSON.stringify(props.scores)))

// Initialize corporationName field if it doesn't exist
localScores.value.forEach(score => {
  if (!score.corporationName) {
    score.corporationName = ''
  }
})

// Check if a corporation is already selected by another player
const isCorporationSelected = (corpName, currentPlayerIndex) => {
  if (!corpName) return false
  return localScores.value.some((score, idx) => 
    idx !== currentPlayerIndex && score.corporationName === corpName
  )
}

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

const scoreCategories = [
  { key: 'tr', label: 'NT' },
  { key: 'rewards', label: 'Récompenses' },
  { key: 'objectives', label: 'Objectifs' },
  { key: 'forests', label: 'Forêts' },
  { key: 'cities', label: 'Villes' },
  { key: 'cards', label: 'Cartes' }
]

function handleCorporationChange(playerIndex) {
  const corpName = localScores.value[playerIndex].corporationName
  const corp = corporations.find(c => c.name === corpName)
  
  // Update the corporation value based on selected name
  if (corp) {
    localScores.value[playerIndex].corporation = corp.value
  } else {
    localScores.value[playerIndex].corporation = 0
  }
  
  handleScoreChange()
}

function handleScoreChange() {
  emit('update:scores', localScores.value)
  emit('calculate')
}

function handleSave() {
  if (confirm('Are you sure you want to save these scores?')) {
    emit('save')
  }
}

// Watch for external score changes
watch(() => props.scores, (newScores) => {
  localScores.value = JSON.parse(JSON.stringify(newScores))
}, { deep: true })
</script>

<style scoped>
.scorecard {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.scorecard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.score-table {
  width: 100%;
  border-collapse: collapse;
}

.score-table th {
  background: #667eea;
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
}

.score-table td {
  padding: 10px 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.category-cell {
  background: #ff7043;
  color: white;
  font-weight: bold;
  text-align: left !important;
  padding-left: 15px !important;
}

.total-row {
  background: #ffecb3;
  font-weight: bold;
}

.rank-row {
  background: #b0bec5;
  font-weight: bold;
}

.player-name-input,
.score-input,
.score-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  text-align: center;
  font-size: 14px;
  box-sizing: border-box;
}

.player-name-input {
  background: #f8f9fa;
}

.score-input:focus,
.score-select:focus {
  outline: none;
  border-color: #667eea;
}

.player-header {
  background: #5c6bc0;
}

.save-section {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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

.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.95);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .score-table {
    font-size: 12px;
  }
  
  .score-table th,
  .score-table td {
    padding: 6px 4px;
  }
  
  .score-input,
  .score-select,
  .player-name-input {
    padding: 6px;
    font-size: 12px;
  }
}
</style>