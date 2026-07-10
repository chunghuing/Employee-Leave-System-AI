import { computed, ref } from 'vue'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function useDateRange() {
  const startDate = ref('')
  const endDate = ref('')

  const isValidRange = computed(
    () => Boolean(startDate.value) && Boolean(endDate.value) && endDate.value >= startDate.value,
  )

  const days = computed(() => {
    if (!isValidRange.value) {
      return 0
    }

    return (Date.parse(endDate.value) - Date.parse(startDate.value)) / MS_PER_DAY + 1
  })

  function reset() {
    startDate.value = ''
    endDate.value = ''
  }

  return {
    startDate,
    endDate,
    days,
    isValidRange,
    reset,
  }
}
