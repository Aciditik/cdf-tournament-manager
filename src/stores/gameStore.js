import { defineStore } from 'pinia'
import api from '@/services/api'

export const useGameStore = defineStore('game', {
  state: () => ({
    players: [],
    games: [],
    scorecards: [],
    loading: false,
    draggedPlayer: null,
    currentRound: 1,
    currentPhase: 1, // 1 = Qualification, 2 = Finals
    placementPointsMap: { 1: 5, 2: 3, 3: 2, 4: 1 }
  }),

  getters: {
    unassignedPlayers: (state) => state.players.filter(p => !p.gameId),
    
    totalPlayers: (state) => state.players.length,
    
    totalGames: (state) => state.games.length,
    
    unassignedCount: (state) => state.players.filter(p => !p.gameId).length,

    rankings: (state) => {
      const allRankings = []
      state.scorecards.forEach(scorecard => {
        const game = state.games.find(g => g.id === scorecard.gameId)
        scorecard.players.forEach(player => {
          if (player.name) {
            allRankings.push({
              name: player.name,
              game: game?.name || 'Unknown Game',
              total: player.total,
              rank: player.rank,
              scores: player.scores
            })
          }
        })
      })
      return allRankings.sort((a, b) => b.total - a.total)
    },

    // Swiss standings with placement points
    swissStandings: (state) => {
      // Build player stats from scorecards
      const playerStats = new Map()
      
      state.players.forEach(player => {
        playerStats.set(player.id, {
          id: player.id,
          name: player.name,
          placementPoints: 0,
          totalGameScore: 0,
          rounds: [],
          placementHistory: []
        })
      })

      // Process each scorecard
      state.scorecards.forEach(scorecard => {
        scorecard.players.forEach(playerData => {
          const player = state.players.find(p => p.name === playerData.name)
          if (player && playerStats.has(player.id)) {
            const stats = playerStats.get(player.id)
            const placement = playerData.placement || playerData.rank
            const placementPoints = state.placementPointsMap[placement] || 0
            
            stats.placementPoints += placementPoints
            stats.totalGameScore += playerData.total || 0
            stats.placementHistory.push(placementPoints)
            stats.rounds.push({
              roundNumber: scorecard.roundNumber || 1,
              gameId: scorecard.gameId,
              placement: placement,
              placementPoints: placementPoints,
              gameScore: playerData.total || 0
            })
          }
        })
      })

      // Convert to array and sort
      return Array.from(playerStats.values())
        .filter(p => p.rounds.length > 0) // Only players with games
        .sort((a, b) => {
          // Primary: Placement points (descending)
          if (b.placementPoints !== a.placementPoints) {
            return b.placementPoints - a.placementPoints
          }
          // Tiebreaker: Total game score (descending)
          return b.totalGameScore - a.totalGameScore
        })
        .map((player, index) => ({
          ...player,
          rank: index + 1,
          displayRank: `${player.placementPoints} pts (${player.totalGameScore})`,
          historyDisplay: player.placementHistory.join(' - ')
        }))
    }
  },

  actions: {
    async fetchData() {
      this.loading = true
      try {
        const data = await api.getData()
        this.players = data.players
        this.scorecards = data.scorecards
        this.extractGames()
      } catch (error) {
        console.error('Error fetching data:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async registerPlayer(name) {
      const player = {
        id: Date.now(),
        name: name.trim(),
        created_at: new Date().toISOString(),
        gameId: null
      }
      this.players.push(player)
      await this.saveData()
    },

    async deletePlayer(playerId) {
      this.players = this.players.filter(p => p.id !== playerId)
      await this.saveData()
    },

    async clearAllPlayers() {
      this.players = []
      this.games = []
      await this.saveData()
    },

    extractGames() {
      this.games = []
      const gameIds = new Set()
      
      this.players.forEach(player => {
        if (player.gameId && !gameIds.has(player.gameId)) {
          gameIds.add(player.gameId)
          const gamePlayers = this.players.filter(p => p.gameId === player.gameId)
          this.games.push({
            id: player.gameId,
            name: `Game ${this.games.length + 1}`,
            players: gamePlayers
          })
        }
      })
    },

    addNewGame() {
      const gameId = Date.now()
      this.games.push({
        id: gameId,
        name: `Game ${this.games.length + 1}`,
        players: []
      })
    },

    async autoAssignGames() {
      // Reset all assignments
      this.players.forEach(p => p.gameId = null)
      this.games = []

      const totalPlayers = this.players.length
      if (totalPlayers === 0) return

      // Calculate number of games
      const numGames = Math.ceil(totalPlayers / 4)
      
      // Create games
      for (let i = 0; i < numGames; i++) {
        this.games.push({
          id: Date.now() + i,
          name: `Game ${i + 1}`,
          players: []
        })
      }

      // Distribute players
      const shuffled = [...this.players].sort(() => Math.random() - 0.5)
      shuffled.forEach((player, index) => {
        const gameIndex = index % numGames
        player.gameId = this.games[gameIndex].id
      })

      await this.saveData()
      this.extractGames()
    },

    async assignPlayerToGame(playerId, gameId) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.gameId = gameId
        await this.saveData()
        this.extractGames()
      }
    },

    async removePlayerFromGame(playerId) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.gameId = null
        await this.saveData()
        this.extractGames()
      }
    },

    async deleteGame(gameId) {
      // Unassign players
      this.players.forEach(p => {
        if (p.gameId === gameId) p.gameId = null
      })
      
      this.games = this.games.filter(g => g.id !== gameId)
      await this.saveData()
      this.extractGames()
    },

    async clearAllGames() {
      this.players.forEach(p => p.gameId = null)
      this.games = []
      await this.saveData()
      this.extractGames()
    },

    async saveScorecard(scorecard) {
      const existingIndex = this.scorecards.findIndex(s => s.gameId === scorecard.gameId)
      if (existingIndex >= 0) {
        this.scorecards[existingIndex] = scorecard
      } else {
        this.scorecards.push(scorecard)
      }
      await this.saveData()
    },

    async deleteScorecards() {
      this.scorecards = []
      await this.saveData()
    },

    async saveData() {
      await api.saveData(this.players, this.scorecards)
    },

    // Calculate placements automatically from game scores
    calculatePlacements(players) {
      // Sort by total score (descending)
      const sorted = [...players].sort((a, b) => b.total - a.total)
      
      // Assign placements
      sorted.forEach((player, index) => {
        player.placement = index + 1
        player.placementPoints = this.placementPointsMap[index + 1] || 0
      })
      
      return sorted
    },

    // Helper to get placement points
    getPlacementPoints(placement) {
      return this.placementPointsMap[placement] || 0
    },

    // Start a new round with Swiss pairing (or random for Round 1)
    async startNewRound() {
      // Check if we have any players
      if (this.players.length < 4) {
        throw new Error('Need at least 4 registered players to create games.')
      }

      // Clear current game assignments
      this.players.forEach(p => p.gameId = null)
      this.games = []

      // Get current standings
      const standings = this.swissStandings
      
      let sortedPlayers

      // Round 1: Random or all players
      if (this.currentRound === 1 || standings.length === 0) {
        // Use all registered players for Round 1
        sortedPlayers = [...this.players].sort(() => Math.random() - 0.5) // Shuffle randomly
      } else {
        // Round 2+: Swiss pairing based on standings
        // Get players who have played at least one game
        const activePlayers = this.players.filter(p => 
          standings.some(s => s.id === p.id)
        )

        if (activePlayers.length < 4) {
          throw new Error('Need at least 4 players with completed games for Swiss pairing.')
        }

        // Sort players by current standings
        sortedPlayers = activePlayers.sort((a, b) => {
          const aStats = standings.find(s => s.id === a.id)
          const bStats = standings.find(s => s.id === b.id)
          
          // Sort by placement points, then by game score
          if (bStats.placementPoints !== aStats.placementPoints) {
            return bStats.placementPoints - aStats.placementPoints
          }
          return bStats.totalGameScore - aStats.totalGameScore
        })
      }

      // Create games
      const numGames = Math.ceil(sortedPlayers.length / 4)
      
      for (let i = 0; i < numGames; i++) {
        const gameId = Date.now() + i
        this.games.push({
          id: gameId,
          name: `Round ${this.currentRound} - Game ${i + 1}`,
          players: [],
          roundNumber: this.currentRound
        })
      }

      // Assign players to games
      sortedPlayers.forEach((player, index) => {
        const gameIndex = Math.floor(index / 4)
        if (gameIndex < this.games.length) {
          player.gameId = this.games[gameIndex].id
        }
      })

      // Increment round number
      this.currentRound++

      await this.saveData()
      this.extractGames()
    },

    // Reset tournament (start fresh)
    async resetTournament() {
      this.currentRound = 1
      this.currentPhase = 1
      this.players.forEach(p => p.gameId = null)
      this.games = []
      this.scorecards = []
      await this.saveData()
    },

    // Advance to next phase (Top 32)
    async advanceToPhase2() {
      const standings = this.swissStandings
      
      if (standings.length < 32) {
        throw new Error('Need at least 32 players to advance to Phase 2.')
      }

      // Get top 32 players
      const top32 = standings.slice(0, 32)
      const top32Ids = new Set(top32.map(p => p.id))

      // Remove players not in top 32
      this.players = this.players.filter(p => top32Ids.has(p.id))

      // Clear game assignments
      this.players.forEach(p => p.gameId = null)
      this.games = []

      // Reset scores for phase 2 (fresh start)
      this.scorecards = []

      // Update phase and reset round
      this.currentPhase = 2
      this.currentRound = 4 // Phase 2 starts at round 4

      await this.saveData()
    }
  }
})