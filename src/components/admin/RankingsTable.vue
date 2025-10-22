<template>
  <table class="rankings-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Player Name</th>
        <th>Game</th>
        <th>Total Score</th>
        <th>Game Rank</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="rankings.length === 0">
        <td colspan="5" style="text-align: center; padding: 30px; color: #999;">
          No rankings available
        </td>
      </tr>
      <tr v-else v-for="(player, index) in rankings" :key="index">
        <td class="rank-cell">
          <span v-if="index === 0">🥇 1</span>
          <span v-else-if="index === 1">🥈 2</span>
          <span v-else-if="index === 2">🥉 3</span>
          <span v-else>{{ index + 1 }}</span>
        </td>
        <td><strong>{{ player.name }}</strong></td>
        <td>{{ player.game }}</td>
        <td class="score-cell">{{ player.total }}</td>
        <td>{{ player.rank }}</td>
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

<style scoped>
.rankings-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.rankings-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.rankings-table th {
  padding: 15px;
  text-align: left;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
}

.rankings-table td {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
}

.rankings-table tbody tr:hover {
  background: #f8f9fa;
}

.rankings-table tbody tr:last-child td {
  border-bottom: none;
}

.rank-cell {
  font-weight: bold;
  font-size: 18px;
}

.score-cell {
  font-weight: bold;
  color: #667eea;
  font-size: 18px;
}
</style>