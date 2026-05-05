<template>
  <Transition 
    name="modal"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="confirmState.show" class="fixed inset-0 z-10000 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="onCancel"></div>
      
      <div class="relative w-full max-w-sm overflow-hidden rounded-4xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div class="p-8 text-center">
          <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <HelpCircle :size="32" />
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">{{ confirmState.title }}</h3>
          <p class="mt-3 text-sm font-medium text-slate-500 leading-relaxed">
            {{ confirmState.message }}
          </p>
        </div>
        
        <div class="flex border-t border-slate-100">
          <button 
            @click="onCancel"
            class="flex-1 px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <div class="w-px bg-slate-100"></div>
          <button 
            @click="onConfirm"
            class="flex-1 px-6 py-5 text-xs font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useConfirm } from '../composables/useConfirm'
import { HelpCircle } from 'lucide-vue-next'

const { confirmState, onConfirm, onCancel } = useConfirm()
</script>
