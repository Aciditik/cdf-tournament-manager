<template>
  <div :class="[
    'bg-[#f8f9fa] rounded-[10px] p-5 border-2 transition-colors',
    game.players.length >= 4 ? 'border-[#28a745]' : 'border-[#ddd]'
  ]">
    <div class="flex justify-between items-center mb-[15px]">
      <div class="text-lg font-bold text-[#333] flex-1">{{ game.name }}</div>
      <div :class="[
        'text-white py-1 px-3 rounded-[20px] text-sm font-bold mr-2.5',
        game.players.length >= 4 ? 'bg-[#28a745]' : 'bg-primary'
      ]">
        {{ game.players.length }}/4
      </div>
      <button class="bg-[#dc3545] text-white border-none rounded-full w-6 h-6 cursor-pointer text-xs flex items-center justify-center transition-colors hover:bg-[#c82333]" @click="$emit('delete-game', game.id)" title="Delete Game">
        ✖
      </button>
    </div>

    <div class="flex flex-col gap-2">
      <div 
        v-for="i in 4" 
        :key="i"
        :class="[
          'bg-white p-3 rounded-[5px] border-2 min-h-[45px] flex items-center justify-between transition-all',
          game.players[i-1] ? 'border-solid border-primary bg-[#f0f4ff]' : 'border-dashed border-[#ddd]',
          dragOver === i ? 'bg-[#e3f2fd] border-[#2196f3] scale-[1.02]' : ''
        ]"
        @drop="handleDrop(i)"
        @dragover.prevent="dragOver = i"
        @dragleave="dragOver = null"
      >
        <template v-if="game.players[i-1]">
          <span class="font-medium text-[#333]">{{ game.players[i-1].name }}</span>
          <button 
            class="bg-[#dc3545] text-white border-none rounded px-2 py-1 cursor-pointer text-xs transition-colors hover:bg-[#c82333]" 
            @click="$emit('remove-player', game.players[i-1].id)"
            title="Remove player"
          >
            ✖
          </button>
        </template>
        <span v-else class="text-[#999] text-sm">Empty Slot {{ i }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['assign-player', 'remove-player', 'delete-game'])
const gameStore = useGameStore()
const dragOver = ref(null)

function handleDrop(slotIndex) {
  dragOver.value = null
  
  if (!gameStore.draggedPlayer) return
  
  // Check if game is full
  if (props.game.players.length >= 4) {
    alert('This game is full (4 players max)')
    return
  }
  
  // Check if player is already in this game
  const alreadyInGame = props.game.players.some(p => p.id === gameStore.draggedPlayer.id)
  if (alreadyInGame) {
    alert('Player is already in this game')
    return
  }
  
  emit('assign-player', {
    playerId: gameStore.draggedPlayer.id,
    gameId: props.game.id
  })
  
  gameStore.draggedPlayer = null
}
</script>