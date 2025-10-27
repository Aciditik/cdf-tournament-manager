<template>
  <div class="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
    <div class="bg-gradient-to-br from-primary to-primary-dark text-white p-5">
      <h2 class="text-2xl font-bold mb-2">🏆 Swiss Tournament Standings</h2>
      <p class="text-sm opacity-90">Ranked by Placement Points (5-3-2-1 system)</p>
    </div>

    <div v-if="standings.length === 0" class="text-center py-[60px] px-5 text-[#999]">
      <p>No standings available yet. Complete some games to see rankings!</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead class="bg-[#f8f9fa]">
          <tr>
            <th class="p-4 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Rank</th>
            <th class="p-4 text-left font-bold text-[#333] border-b-2 border-[#dee2e6]">Player</th>
            <th class="p-4 text-center font-bold text-[#333] border-b-2 border-[#dee2e6]">Placement Points</th>
            <th class="p-4 text-center font-bold text-[#333] border-b-2 border-[#dee2e6]">Game Score Total</th>
            <th class="p-4 text-center font-bold text-[#333] border-b-2 border-[#dee2e6]">History</th>
            <th class="p-4 text-center font-bold text-[#333] border-b-2 border-[#dee2e6]">Games Played</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="player in standings" 
            :key="player.id"
            :class="[
              'hover:bg-[#f8f9fa] transition-colors',
              player.rank <= 32 ? 'bg-green-50' : ''
            ]"
          >
            <td class="p-4 border-b border-[#dee2e6]">
              <span class="font-bold text-lg">
                <span v-if="player.rank === 1">🥇</span>
                <span v-else-if="player.rank === 2">🥈</span>
                <span v-else-if="player.rank === 3">🥉</span>
                {{ player.rank }}
              </span>
              <span v-if="player.rank <= 32" class="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Qualified
              </span>
            </td>
            <td class="p-4 border-b border-[#dee2e6]">
              <strong class="text-base">{{ player.name }}</strong>
            </td>
            <td class="p-4 border-b border-[#dee2e6] text-center">
              <span class="font-bold text-primary text-xl">{{ player.placementPoints }}</span>
              <span class="text-sm text-[#666]"> pts</span>
            </td>
            <td class="p-4 border-b border-[#dee2e6] text-center">
              <span class="text-[#666]">({{ player.totalGameScore }})</span>
            </td>
            <td class="p-4 border-b border-[#dee2e6] text-center">
              <div class="flex gap-1 justify-center flex-wrap">
                <span 
                  v-for="(points, idx) in player.placementHistory" 
                  :key="idx"
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold',
                    points === 5 ? 'bg-yellow-100 text-yellow-800' : '',
                    points === 3 ? 'bg-gray-200 text-gray-700' : '',
                    points === 2 ? 'bg-orange-100 text-orange-700' : '',
                    points === 1 ? 'bg-blue-100 text-blue-700' : ''
                  ]"
                >
                  {{ points }}
                </span>
              </div>
            </td>
            <td class="p-4 border-b border-[#dee2e6] text-center text-[#666]">
              {{ player.rounds.length }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-[#f8f9fa] p-5 border-t-2 border-[#dee2e6]">
      <div class="flex flex-wrap gap-6 text-sm">
        <div>
          <strong class="text-[#333]">Placement Points:</strong>
          <span class="ml-2 text-[#666]">1st=5pts, 2nd=3pts, 3rd=2pts, 4th=1pt</span>
        </div>
        <div>
          <strong class="text-[#333]">Tiebreaker:</strong>
          <span class="ml-2 text-[#666]">Sum of all game scores</span>
        </div>
        <div>
          <strong class="text-[#333]">Top 32:</strong>
          <span class="ml-2 text-[#666]">Qualify for finals</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  standings: {
    type: Array,
    default: () => []
  }
})
</script>
