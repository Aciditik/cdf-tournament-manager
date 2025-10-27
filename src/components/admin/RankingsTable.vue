<template>
  <table class="w-full border-collapse bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
    <thead class="bg-gradient-to-br from-primary to-primary-dark text-white">
      <tr>
        <th class="p-[15px] text-left font-bold uppercase text-xs tracking-wider">Rank</th>
        <th class="p-[15px] text-left font-bold uppercase text-xs tracking-wider">Player Name</th>
        <th class="p-[15px] text-left font-bold uppercase text-xs tracking-wider">Game</th>
        <th class="p-[15px] text-left font-bold uppercase text-xs tracking-wider">Total Score</th>
        <th class="p-[15px] text-left font-bold uppercase text-xs tracking-wider">Game Rank</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="rankings.length === 0">
        <td colspan="5" class="text-center p-[30px] text-[#999]">
          No rankings available
        </td>
      </tr>
      <tr v-else v-for="(player, index) in rankings" :key="index" class="hover:bg-[#f8f9fa] last:border-b-0">
        <td class="p-[15px] border-b border-[#dee2e6] font-bold text-lg">
          <span v-if="index === 0">🥇 1</span>
          <span v-else-if="index === 1">🥈 2</span>
          <span v-else-if="index === 2">🥉 3</span>
          <span v-else>{{ index + 1 }}</span>
        </td>
        <td class="p-[15px] border-b border-[#dee2e6]"><strong>{{ player.name }}</strong></td>
        <td class="p-[15px] border-b border-[#dee2e6]">{{ player.game }}</td>
        <td class="p-[15px] border-b border-[#dee2e6] font-bold text-primary text-lg">{{ player.total }}</td>
        <td class="p-[15px] border-b border-[#dee2e6]">{{ player.rank }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  rankings: {
    type: Array,
    default: () => []
  }
})
</script>