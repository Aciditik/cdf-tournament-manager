<template>
  <div class="bg-white p-5 rounded-b-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
    <!-- Fix Scorecards Tool -->
    <div class="mb-6">
      <FixScorecards @message="(text, type) => emit('message', text, type)" />
    </div>

    <div class="flex gap-2.5 mb-5 flex-wrap">
      <button class="py-2.5 px-5 bg-primary text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#5568d3]" @click="refreshData">🔄 Refresh Scorecards</button>
      <button class="py-2.5 px-5 bg-primary text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors hover:bg-[#5568d3]" @click="exportRankings">📅 Export Rankings</button>
      <button class="py-2.5 px-5 bg-[#c82333] text-white border-none rounded-[5px] cursor-pointer text-sm font-bold transition-colors" @click="deleteScorecards">🗑️ Delete Scorecards</button>
    </div>

    <!-- Scorecards Display -->
    <div v-if="gameStore.scorecards.length === 0" class="text-center py-[60px] px-5 text-[#999]">
      <p>No scorecards submitted yet.</p>
    </div>
    <div v-else class="mb-10">
      <div v-for="scorecard in gameStore.scorecards" :key="scorecard.gameId" class="bg-[#f8f9fa] p-5 rounded-[10px] mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <h3 class="text-primary mb-1.5">🎮 {{ getGameName(scorecard.gameId) }}</h3>
        <p class="text-[#666] text-sm mb-[15px]">Saved: {{ formatDate(scorecard.savedAt) }}</p>
        
        <table class="w-full border-collapse bg-white rounded-[5px] overflow-hidden">
          <thead class="bg-primary text-white">
            <tr>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Joueurs</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Corporation</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">NT</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Objectifs</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Récompenses</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Forêts</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Villes</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Cartes</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Total</th>
              <th class="p-2.5 text-center border-b border-[#dee2e6]">Classement</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in scorecard.players" :key="player.name" class="hover:bg-[#f8f9fa]">
              <td class="p-2.5 text-center border-b border-[#dee2e6]"><strong>{{ player.name }}</strong></td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]">{{ player.scores.corporationName }}</td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]">{{ player.scores.tr }}</td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]">{{ player.scores.rewards }}</td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]">{{ player.scores.objectives }}</td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]">{{ player.scores.forests }}</td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]">{{ player.scores.cities }}</td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]">{{ player.scores.cards }}</td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]"><strong>{{ player.total }}</strong></td>
              <td class="p-2.5 text-center border-b border-[#dee2e6]"><strong>{{ player.rank }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cumulative Rankings -->
    <div class="mt-10">
      <CumulativeRankings :rankings="gameStore.rankings" />
    </div>

    <!-- Individual Game Rankings -->
    <div class="mt-10">
      <OverallRankings :rankings="gameStore.rankings" />
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
import FixScorecards from './FixScorecards.vue'

const emit = defineEmits(['message'])
const gameStore = useGameStore()

function getGameName(gameId) {
  const game = gameStore.games.find(g => g.id === gameId)
  return game ? game.name : 'Unknown Game'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

async function refreshData() {
  try {
    await gameStore.fetchData()
    emit('message', '✅ Scorecards refreshed', 'success')
  } catch (error) {
    emit('message', '❌ Error refreshing: ' + error.message, 'error')
  }
}

function exportRankings() {
  const json = JSON.stringify(gameStore.rankings, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rankings_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  emit('message', '✅ Rankings exported', 'success')
}

async function deleteScorecards() {
  if (confirm('Are you sure you want to delete ALL scorecards? This action cannot be undone.')) {
    try {
      await gameStore.deleteScorecards()
      emit('message', '✅ Scorecards deleted', 'success')
    } catch (error) {
      emit('message', '❌ Error deleting scorecards: ' + error.message, 'error')
    }
  }
}
</script>