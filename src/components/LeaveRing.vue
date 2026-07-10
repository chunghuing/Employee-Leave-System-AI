<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    remaining: number
    total: number
    unitLabel?: string
    size?: number
    variant?: 'dark' | 'light'
  }>(),
  {
    unitLabel: '天可用',
    size: 160,
    variant: 'dark',
  },
)

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const percentage = computed(() => {
  if (props.total <= 0) {
    return 0
  }
  return Math.min(1, Math.max(0, props.remaining / props.total))
})

const dashArray = computed(() => `${percentage.value * CIRCUMFERENCE} ${CIRCUMFERENCE}`)
const valueFontSize = computed(() => Math.round(props.size * 0.22))
const labelFontSize = computed(() => Math.max(10, Math.round(props.size * 0.075)))
</script>

<template>
  <div
    class="leave-ring"
    :class="`leave-ring--${variant}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg :width="size" :height="size" viewBox="0 0 100 100" class="leave-ring__svg">
      <circle class="leave-ring__track" cx="50" cy="50" r="42" fill="none" stroke-width="14" />
      <circle
        class="leave-ring__arc"
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke-width="14"
        stroke-linecap="round"
        :stroke-dasharray="dashArray"
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div class="leave-ring__center">
      <span class="leave-ring__value" :style="{ fontSize: `${valueFontSize}px` }">{{
        remaining
      }}</span>
      <span class="leave-ring__label" :style="{ fontSize: `${labelFontSize}px` }">{{
        unitLabel
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.leave-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.leave-ring__svg {
  width: 100%;
  height: 100%;
}

.leave-ring__track {
  stroke: var(--border-color);
}

.leave-ring--dark .leave-ring__track {
  stroke: var(--ink-soft);
}

.leave-ring__arc {
  stroke: var(--amber);
  transition: stroke-dasharray 0.3s ease;
}

.leave-ring__center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.leave-ring__value {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1;
  color: var(--text-primary);
}

.leave-ring__label {
  font-family: var(--font-body);
  color: var(--text-secondary);
}

.leave-ring--dark .leave-ring__value {
  color: var(--text-inverse);
}

.leave-ring--dark .leave-ring__label {
  color: var(--text-muted-inverse);
}
</style>
