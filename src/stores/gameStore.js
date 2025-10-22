import { defineStore } from 'pinia'
import api from '@/services/api'

export const useGameStore = defineStore('game', {
  state: () => ({
    players: [],
    games: [],
    scorecards: [],
    loading: false,
    draggedPlayer: null
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

    async saveData() {
      await api.saveData(this.players, this.scorecards)
    }
  }
})