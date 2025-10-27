<template>
  <div>
    <div class="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.1)] mb-5">
      <div class="bg-gradient-to-br from-primary to-primary-dark text-white p-[15px] text-center text-xl font-bold">{{ scorecardTitle }}</div>
      
      <div class="overflow-x-auto">
        <table class="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th class="bg-primary text-white p-3 text-center text-[13px] font-bold">Table 1</th>
            <th v-for="i in 4" :key="i" class="bg-[#5c6bc0] text-white p-3 text-center text-[13px] font-bold">Joueur #{{ i }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Player Names -->
          <tr>
            <td class="bg-[#ff7043] text-white font-bold text-left pl-[15px] p-2.5 text-center border border-[#ddd]">Nom du joueur</td>
            <td v-for="i in 4" :key="i" class="p-2.5 text-center border border-[#ddd]">
              <input 
                type="text" 
                :value="playerNames[i-1]" 
                readonly
                class="w-full p-2 border border-[#ddd] rounded bg-[#f8f9fa] text-center text-sm box-border"
              >
            </td>
          </tr>
          
          <!-- Corporation -->
          <tr>
            <td class="bg-[#ff7043] text-white font-bold text-left pl-[15px] p-2.5 text-center border border-[#ddd]">Corporation</td>
            <td v-for="i in 4" :key="i" class="p-2.5 text-center border border-[#ddd]">
              <select 
                v-model="localScores[i-1].corporationName"
                @change="handleCorporationChange(i-1)"
                class="w-full p-2 border border-[#ddd] rounded text-center text-sm box-border focus:outline-none focus:border-primary"
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
            <td class="bg-[#ff7043] text-white font-bold text-left pl-[15px] p-2.5 text-center border border-[#ddd]">{{ category.label }}</td>
            <td v-for="i in 4" :key="i" class="p-2.5 text-center border border-[#ddd]">
              <input 
                type="number" 
                v-model.number="localScores[i-1][category.key]"
                @input="handleScoreChange"
                @keypress="validateNumberInput"
                class="w-full p-2 border border-[#ddd] rounded text-center text-sm box-border focus:outline-none focus:border-primary"
                min="0"
                step="1"
                inputmode="numeric"
                pattern="[0-9]*"
              >
            </td>
          </tr>
          
          <!-- Total Row -->
          <tr class="bg-[#ffecb3] font-bold">
            <td class="bg-[#ff7043] text-white font-bold text-left pl-[15px] p-2.5 text-center border border-[#ddd]">Total</td>
            <td v-for="(total, i) in totals" :key="i" class="p-2.5 text-center border border-[#ddd]">{{ total }}</td>
          </tr>
          
          <!-- Rank Row -->
          <tr class="bg-[#b0bec5] font-bold">
            <td class="bg-[#ff7043] text-white font-bold text-left pl-[15px] p-2.5 text-center border border-[#ddd]">Classement</td>
            <td v-for="(rank, i) in ranks" :key="i" class="p-2.5 text-center border border-[#ddd]">{{ rank }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <div class="text-center p-5 bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <button class="py-2.5 px-[30px] bg-gradient-to-br from-primary to-primary-dark text-white border-none rounded-[5px] text-base cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed md:text-sm md:py-2 md:px-5" @click="handleSave">💾 Save Scores</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  scorecardTitle: String,
  playerNames: Array,
  placements: Array,
  placementPoints: Array,
  scores: Array,
  totals: Array,
  ranks: Array
})

const emit = defineEmits(['update:scores', 'update:placements', 'calculate', 'save'])

const localScores = ref(JSON.parse(JSON.stringify(props.scores)))
const localPlacements = ref([...props.placements])

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

const scoreCategories = [
  { key: 'tr', label: 'NT' },
  { key: 'objectives', label: 'Objectifs' },
  { key: 'rewards', label: 'Récompenses' },
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

function validateNumberInput(event) {
  // Allow only digits (0-9)
  const char = String.fromCharCode(event.keyCode || event.which)
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault()
  }
}

function handlePlacementChange() {
  emit('update:placements', localPlacements.value)
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