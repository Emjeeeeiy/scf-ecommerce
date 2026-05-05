<template>
  <div class="fixed top-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none w-full max-w-sm">
    <TransitionGroup 
      name="toast"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-2xl bg-white p-4 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100"
      >
        <div 
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          :class="{
            'bg-emerald-50 text-emerald-600': toast.type === 'success',
            'bg-rose-50 text-rose-600': toast.type === 'error',
            'bg-amber-50 text-amber-600': toast.type === 'warning',
            'bg-blue-50 text-blue-600': toast.type === 'info',
          }"
        >
          <CheckCircle2 v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else-if="toast.type === 'error'" :size="18" />
          <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
          <Info v-else :size="18" />
        </div>
        
        <div class="flex-1 pt-0.5">
          <p class="text-xs font-bold text-slate-900 leading-relaxed">{{ toast.message }}</p>
        </div>

        <button 
          @click="removeToast(toast.id)"
          class="shrink-0 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-vue-next'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-move {
  transition: all 0.3s ease;
}
</style>
