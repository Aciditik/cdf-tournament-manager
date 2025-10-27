<template>
  <div class="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
    <div class="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-5">
      <h2 class="text-2xl font-bold mb-2">📊 Cumulative Rankings</h2>
      <p class="text-sm opacity-90">Total scores across all games played</p>
    </div>

    <div v-if="cumulativeRankings.length === 0" class="text-center py-[60px] px-5 text-[#999]">
      <p>No rankings available yet. Complete some games to see rankings!</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead class="bg-[#f8f9fa]">
          <tr>
            <th class="p-4 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Rank</th>
            <th class="p-4 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Player Name</th>
            <th class="p-4 text-center font-bold text-[#333] border-b-2 border-[#dee2e6]">Total Score</th>
            <th class="p-4 text-center font-bold text-[#333] border-b-2 border-[#dee2e6]">Games Played</th>
            <th class="p-4 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Game Breakdown</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(player, index) in cumulativeRankings" 
            :key="player.name"
            class="hover:bg-[#f8f9fa] transition-colors"
          >
            <td class="p-4 border-b border-[#dee2e6]">
              <span class="font-bold text-lg">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                {{ index + 1 }}
              </span>
            </td>
            <td class="p-4 border-b border-[#dee2e6]">
              <strong class="text-base">{{ player.name }}</strong>
            </td>
            <td class="p-4 border-b border-[#dee2e6] text-center">
              <span class="font-bold text-purple-600 text-xl">{{ player.totalScore }}</span>
              <span class="text-sm text-[#666]"> pts</span>
            </td>
            <td class="p-4 border-b border-[#dee2e6] text-center text-[#666]">
              {{ player.gamesPlayed }}
            </td>
            <td class="p-4 border-b border-[#dee2e6]">
              <div class="flex gap-2 flex-wrap">
                <span 
                  v-for="(game, idx) in player.games" 
                  :key="idx"
                  class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                  :title="`${game.gameName}: ${game.score} pts`"
                >
                  {{ game.score }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-[#f8f9fa] p-5 border-t-2 border-[#dee2e6]">
      <div class="text-sm text-[#666]">
        <strong class="text-[#333]">Total Players:</strong> {{ cumulativeRankings.length }} players with completed games
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rankings: {
    type: Array,
    default: () => []
  }
})

const cumulativeRankings = computed(() => {
  // Group rankings by player name
  const playerMap = new Map()
  
  props.rankings.forEach(ranking => {
    if (!playerMap.has(ranking.name)) {
      playerMap.set(ranking.name, {
        name: ranking.name,
        totalScore: 0,
        gamesPlayed: 0,
        games: []
      })
    }
    
    const player = playerMap.get(ranking.name)
    player.totalScore += ranking.total
    player.gamesPlayed++
    player.games.push({
      gameName: ranking.game,
      score: ranking.total
    })
  })
  
  // Convert to array and calculate averages
  const players = Array.from(playerMap.values()).map(player => ({
    ...player,
    averageScore: player.totalScore / player.gamesPlayed
  }))
  
  // Sort by total score (descending)
  return players.sort((a, b) => b.totalScore - a.totalScore)
})
</script>
