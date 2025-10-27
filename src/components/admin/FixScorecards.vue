<template>
  <div class="bg-white rounded-[10px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
    <div class="mb-4">
      <h3 class="text-xl font-bold text-[#333] mb-2">🔧 Fix Scorecard Placements</h3>
      <p class="text-sm text-[#666]">
        This tool will recalculate placement points for all existing scorecards based on actual game scores.
        Use this if you see incorrect placement points in the standings.
      </p>
    </div>

    <div v-if="fixed" class="bg-green-50 border border-green-200 rounded p-4 mb-4">
      <p class="text-green-800 font-bold">✅ Fixed {{ fixedCount }} scorecards!</p>
      <p class="text-sm text-green-700 mt-2">Placements have been recalculated. Refresh the page to see updated standings.</p>
    </div>

    <div class="flex gap-3">
      <button 
        @click="fixPlacements"
        :disabled="fixing || gameStore.scorecards.length === 0"
        class="py-3 px-6 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ fixing ? '⏳ Fixing...' : '🔧 Fix All Placements' }}
      </button>
      
      <button 
        v-if="fixed"
        @click="refreshPage"
        class="py-3 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
      >
        🔄 Refresh Page
      </button>
    </div>

    <div class="mt-4 text-xs text-[#999]">
      <p><strong>What this does:</strong></p>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li>Sorts players in each game by their total score</li>
        <li>Assigns correct placements (1st, 2nd, 3rd, 4th)</li>
        <li>Recalculates placement points (5, 3, 2, 1)</li>
        <li>Saves updated scorecards to database</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import api from '@/services/api'

const gameStore = useGameStore()
const emit = defineEmits(['message'])

const fixing = ref(false)
const fixed = ref(false)
const fixedCount = ref(0)

async function fixPlacements() {
  if (!confirm('This will recalculate placements for ALL scorecards. Continue?')) {
    return
  }

  fixing.value = true
  fixed.value = false
  fixedCount.value = 0

  try {
    // Fetch latest data
    const latestData = await api.getData()
    
    // Process each scorecard
    latestData.scorecards.forEach(scorecard => {
      // Sort players by total score (descending)
      const sortedPlayers = [...scorecard.players]
        .map((player, index) => ({ ...player, originalIndex: index }))
        .sort((a, b) => b.total - a.total)
      
      // Assign correct placements
      sortedPlayers.forEach((player, rank) => {
        const placement = rank + 1 // 1st, 2nd, 3rd, 4th
        const placementPoints = gameStore.getPlacementPoints(placement)
        
        // Update the original player object
        const originalPlayer = scorecard.players[player.originalIndex]
        originalPlayer.placement = placement
        originalPlayer.placementPoints = placementPoints
      })
      
      fixedCount.value++
    })
    
    // Save updated data
    await api.saveData(latestData.players, latestData.scorecards)
    
    // Update local state
    gameStore.players = latestData.players
    gameStore.scorecards = latestData.scorecards
    gameStore.extractGames()
    
    fixed.value = true
    emit('message', `✅ Fixed ${fixedCount.value} scorecards successfully!`, 'success')
  } catch (error) {
    emit('message', `❌ Error fixing scorecards: ${error.message}`, 'error')
  } finally {
    fixing.value = false
  }
}

function refreshPage() {
  window.location.reload()
}
</script>