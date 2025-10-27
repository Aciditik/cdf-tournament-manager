<template>
  <div class="bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-[#333] mb-2">🎯 Round Management</h2>
        <p class="text-sm text-[#666]">Control tournament rounds and Swiss pairing</p>
      </div>
      <div class="text-right">
        <div class="text-sm text-[#666] mb-1">Current Phase</div>
        <div class="text-2xl font-bold text-primary">
          Phase {{ gameStore.currentPhase }}
          <span class="text-sm text-[#666]">
            {{ gameStore.currentPhase === 1 ? '(Qualification)' : '(Finals)' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Current Round Info -->
    <div class="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-5 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm opacity-90 mb-1">Current Round</div>
          <div class="text-4xl font-bold">Round {{ gameStore.currentRound }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm opacity-90 mb-1">Active Games</div>
          <div class="text-3xl font-bold">{{ gameStore.totalGames }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm opacity-90 mb-1">Completed Scorecards</div>
          <div class="text-3xl font-bold">{{ gameStore.scorecards.length }}</div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Start New Round -->
      <div class="border-2 border-green-500 rounded-lg p-5">
        <h3 class="text-lg font-bold text-[#333] mb-2 flex items-center gap-2">
          <span>🚀</span>
          <span>Start New Round</span>
        </h3>
        <p class="text-sm text-[#666] mb-4">
          <span v-if="gameStore.currentRound === 1">
            Generate Round 1 games with random player assignment. All registered players will be assigned to games.
          </span>
          <span v-else>
            Generate Swiss pairings based on current standings. Top-ranked players will face each other.
          </span>
        </p>
        <button 
          @click="handleStartNewRound"
          :disabled="gameStore.players.length < 4"
          class="w-full py-3 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Round {{ gameStore.currentRound }} Pairings
        </button>
        <p class="text-xs text-[#999] mt-2">
          <span v-if="gameStore.currentRound === 1">
            ℹ️ This will create games and randomly assign all registered players
          </span>
          <span v-else>
            ℹ️ This will clear current game assignments and create new games based on seeding
          </span>
        </p>
      </div>

      <!-- Reset Tournament -->
      <div class="border-2 border-red-500 rounded-lg p-5">
        <h3 class="text-lg font-bold text-[#333] mb-2 flex items-center gap-2">
          <span>🔄</span>
          <span>Reset Tournament</span>
        </h3>
        <p class="text-sm text-[#666] mb-4">
          Start completely fresh. Clears all games, scorecards, and resets to Round 1.
        </p>
        <button 
          @click="handleResetTournament"
          class="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
        >
          Reset Everything
        </button>
        <p class="text-xs text-[#999] mt-2">
          ⚠️ This action cannot be undone. Players will remain but all progress will be lost.
        </p>
      </div>
    </div>

    <!-- Swiss Pairing Preview -->
    <div v-if="showPairingPreview" class="mt-6 border-2 border-blue-300 rounded-lg p-5 bg-blue-50">
      <h3 class="text-lg font-bold text-[#333] mb-3">📋 Pairing Preview</h3>
      <p class="text-sm text-[#666] mb-4">
        Here's how players will be grouped for the next round (based on current standings):
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          v-for="(game, idx) in pairingPreview" 
          :key="idx"
          class="bg-white rounded p-3 border border-blue-200"
        >
          <div class="font-bold text-sm text-primary mb-2">Game {{ idx + 1 }}</div>
          <div class="space-y-1 text-sm">
            <div v-for="player in game" :key="player.id" class="flex justify-between">
              <span>{{ player.name }}</span>
              <span class="text-[#666]">{{ player.placementPoints }} pts</span>
            </div>
          </div>
        </div>
      </div>
      <button 
        @click="showPairingPreview = false"
        class="mt-4 text-sm text-blue-600 hover:text-blue-800"
      >
        Hide Preview
      </button>
    </div>

    <!-- Previous Rounds History -->
    <div v-if="showRoundHistory" class="mt-6 border-2 border-purple-300 rounded-lg p-5 bg-purple-50">
      <h3 class="text-lg font-bold text-[#333] mb-3">📜 Previous Rounds History</h3>
      <p class="text-sm text-[#666] mb-4">
        View all completed rounds with games and results:
      </p>
      
      <div v-if="roundHistory.length === 0" class="text-center py-8 text-[#999]">
        No completed rounds yet. Complete some games to see history!
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="round in roundHistory" 
          :key="round.roundNumber"
          class="bg-white rounded-lg p-4 border border-purple-200"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-bold text-lg text-primary">Round {{ round.roundNumber }}</h4>
            <span class="text-sm text-[#666]">{{ round.games.length }} games</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              v-for="game in round.games" 
              :key="game.gameId"
              class="bg-[#f8f9fa] rounded p-3 border border-[#dee2e6]"
            >
              <div class="font-bold text-sm text-[#333] mb-2">{{ game.gameName }}</div>
              <div class="space-y-1 text-sm">
                <div 
                  v-for="player in game.players" 
                  :key="player.name"
                  class="flex justify-between items-center"
                >
                  <span class="flex items-center gap-2">
                    <span v-if="player.placement === 1">🥇</span>
                    <span v-else-if="player.placement === 2">🥈</span>
                    <span v-else-if="player.placement === 3">🥉</span>
                    <span v-else>{{ player.placement }}th</span>
                    <span>{{ player.name }}</span>
                  </span>
                  <span class="text-[#666]">
                    {{ player.total }} pts 
                    <span class="text-green-600 font-bold ml-1">(+{{ player.placementPoints }})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        @click="showRoundHistory = false"
        class="mt-4 text-sm text-purple-600 hover:text-purple-800"
      >
        Hide History
      </button>
    </div>

    <div class="flex gap-3 mt-4">
      <button 
        v-if="!showPairingPreview"
        @click="generatePairingPreview"
        :disabled="gameStore.players.length < 4"
        class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        👁️ Preview Round {{ gameStore.currentRound }} Pairings
      </button>
      
      <button 
        v-if="!showRoundHistory"
        @click="generateRoundHistory"
        :disabled="gameStore.scorecards.length === 0"
        class="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📜 View Previous Rounds History
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const emit = defineEmits(['message'])

const showPairingPreview = ref(false)
const pairingPreview = ref([])
const showRoundHistory = ref(false)
const roundHistory = ref([])

async function handleStartNewRound() {
  if (!confirm(`Start Round ${gameStore.currentRound}? This will create new game pairings based on current standings.`)) {
    return
  }

  try {
    await gameStore.startNewRound()
    emit('message', `✅ Round ${gameStore.currentRound - 1} pairings generated successfully!`, 'success')
  } catch (error) {
    emit('message', `❌ Error: ${error.message}`, 'error')
  }
}

async function handleAdvancePhase2() {
  if (!confirm('Advance to Phase 2 (Finals)? This will:\n- Keep only top 32 players\n- Reset all scores\n- Start Round 4\n\nThis cannot be undone!')) {
    return
  }

  try {
    await gameStore.advanceToPhase2()
    emit('message', '✅ Advanced to Phase 2! Top 32 players qualified.', 'success')
  } catch (error) {
    emit('message', `❌ Error: ${error.message}`, 'error')
  }
}

async function handleResetTournament() {
  if (!confirm('Reset entire tournament? This will:\n- Clear all games\n- Delete all scorecards\n- Reset to Round 1, Phase 1\n- Keep all registered players\n\nThis cannot be undone!')) {
    return
  }

  try {
    await gameStore.resetTournament()
    emit('message', '✅ Tournament reset successfully!', 'success')
  } catch (error) {
    emit('message', `❌ Error: ${error.message}`, 'error')
  }
}

function generatePairingPreview() {
  if (gameStore.players.length < 4) {
    emit('message', '❌ Need at least 4 registered players', 'error')
    return
  }

  const standings = gameStore.swissStandings
  let sortedPlayers

  // Round 1: Random assignment
  if (gameStore.currentRound === 1 || standings.length === 0) {
    sortedPlayers = [...gameStore.players].sort(() => Math.random() - 0.5)
  } else {
    // Round 2+: Swiss pairing
    const activePlayers = gameStore.players.filter(p => 
      standings.some(s => s.id === p.id)
    )

    sortedPlayers = activePlayers.sort((a, b) => {
      const aStats = standings.find(s => s.id === a.id)
      const bStats = standings.find(s => s.id === b.id)
      
      if (bStats.placementPoints !== aStats.placementPoints) {
        return bStats.placementPoints - aStats.placementPoints
      }
      return bStats.totalGameScore - aStats.totalGameScore
    })
  }

  // Group into games of 4
  const preview = []
  for (let i = 0; i < sortedPlayers.length; i += 4) {
    const gamePlayers = sortedPlayers.slice(i, i + 4).map(p => {
      const stats = standings.find(s => s.id === p.id)
      return {
        id: p.id,
        name: p.name,
        placementPoints: stats ? stats.placementPoints : 0
      }
    })
    preview.push(gamePlayers)
  }

  pairingPreview.value = preview
  showPairingPreview.value = true
}

function generateRoundHistory() {
  if (gameStore.scorecards.length === 0) {
    emit('message', '❌ No completed games to show', 'error')
    return
  }

  // Group scorecards by round number
  const roundsMap = new Map()

  gameStore.scorecards.forEach(scorecard => {
    const roundNum = scorecard.roundNumber || 1 // Default to round 1 if not set
    
    if (!roundsMap.has(roundNum)) {
      roundsMap.set(roundNum, [])
    }
    
    // Find game name
    const game = gameStore.games.find(g => g.id === scorecard.gameId)
    const gameName = game ? game.name : `Game ${scorecard.gameId}`
    
    roundsMap.get(roundNum).push({
      gameId: scorecard.gameId,
      gameName: gameName,
      players: scorecard.players.map(p => ({
        name: p.name,
        total: p.total,
        placement: p.placement || p.rank,
        placementPoints: p.placementPoints || 0
      })).sort((a, b) => a.placement - b.placement) // Sort by placement
    })
  })

  // Convert to array and sort by round number
  const history = Array.from(roundsMap.entries())
    .map(([roundNumber, games]) => ({
      roundNumber,
      games
    }))
    .sort((a, b) => a.roundNumber - b.roundNumber)

  roundHistory.value = history
  showRoundHistory.value = true
}
</script>
