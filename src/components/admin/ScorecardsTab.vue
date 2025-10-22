<template>
  <div class="tab-content">
    <div class="action-buttons">
      <button class="action-btn" @click="refreshData">🔄 Refresh Scorecards</button>
      <button class="action-btn" @click="exportRankings">📅 Export Rankings</button>
    </div>

    <!-- Scorecards Display -->
    <div v-if="gameStore.scorecards.length === 0" class="empty-state">
      <p>No scorecards submitted yet.</p>
    </div>
    <div v-else class="scorecards-container">
      <div v-for="scorecard in gameStore.scorecards" :key="scorecard.gameId" class="scorecard-card">
        <h3>🎮 {{ getGameName(scorecard.gameId) }}</h3>
        <p class="saved-date">Saved: {{ formatDate(scorecard.savedAt) }}</p>
        
        <table class="scorecard-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Corp</th>
              <th>TR</th>
              <th>Rewards</th>
              <th>Objectives</th>
              <th>Forests</th>
              <th>Cities</th>
              <th>Cards</th>
              <th>Total</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in scorecard.players" :key="player.name">
              <td><strong>{{ player.name }}</strong></td>
              <td>{{ player.scores.corporation }}</td>
              <td>{{ player.scores.tr }}</td>
              <td>{{ player.scores.rewards }}</td>
              <td>{{ player.scores.objectives }}</td>
              <td>{{ player.scores.forests }}</td>
              <td>{{ player.scores.cities }}</td>
              <td>{{ player.scores.cards }}</td>
              <td><strong>{{ player.total }}</strong></td>
              <td><strong>{{ player.rank }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Rankings Table -->
    <div class="rankings-section">
      <h2>🏆 Overall Rankings</h2>
      <RankingsTable :rankings="gameStore.rankings" />
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
import RankingsTable from './RankingsTable.vue'

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
</script>

<style scoped>
.tab-content {
  background: white;
  padding: 20px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #5568d3;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.scorecards-container {
  margin-bottom: 40px;
}

.scorecard-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.scorecard-card h3 {
  color: #667eea;
  margin-bottom: 5px;
}

.saved-date {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.scorecard-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
}

.scorecard-table th,
.scorecard-table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.scorecard-table thead {
  background: #667eea;
  color: white;
}

.scorecard-table tbody tr:hover {
  background: #f8f9fa;
}

.rankings-section {
  margin-top: 40px;
}

.rankings-section h2 {
  color: #667eea;
  margin-bottom: 20px;
}
</style>