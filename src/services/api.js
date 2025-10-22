import axios from 'axios'

const DB_API_URL = 'https://api.jsonbin.io/v3/b/68f777cb43b1c97be975bb7e'
const DB_API_KEY = '$2a$10$nrEAvkxKI94V3ZAk5YxiQezRgOGew.SEYJUZGHDog17c2dhPqacrq'

const api = axios.create({
  baseURL: DB_API_URL,
  headers: {
    'X-Master-Key': DB_API_KEY,
    'Content-Type': 'application/json'
  }
})

export default {
  async getData() {
    const response = await api.get('')
    return {
      players: response.data.record.players || [],
      scorecards: response.data.record.scorecards || []
    }
  },

  async saveData(players, scorecards) {
    await api.put('', { players, scorecards })
  }
}