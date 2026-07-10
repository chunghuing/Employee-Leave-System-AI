import { describe, expect, it } from 'vitest'
import { useDateRange } from './useDateRange'

describe('useDateRange', () => {
  it('starts empty and invalid', () => {
    const { startDate, endDate, days, isValidRange } = useDateRange()

    expect(startDate.value).toBe('')
    expect(endDate.value).toBe('')
    expect(isValidRange.value).toBe(false)
    expect(days.value).toBe(0)
  })

  it('computes an inclusive day count for a valid range', () => {
    const { startDate, endDate, days, isValidRange } = useDateRange()

    startDate.value = '2026-08-01'
    endDate.value = '2026-08-03'

    expect(isValidRange.value).toBe(true)
    expect(days.value).toBe(3)
  })

  it('treats a same-day range as 1 day', () => {
    const { startDate, endDate, days } = useDateRange()

    startDate.value = '2026-08-01'
    endDate.value = '2026-08-01'

    expect(days.value).toBe(1)
  })

  it('is invalid when the end date is before the start date', () => {
    const { startDate, endDate, days, isValidRange } = useDateRange()

    startDate.value = '2026-08-03'
    endDate.value = '2026-08-01'

    expect(isValidRange.value).toBe(false)
    expect(days.value).toBe(0)
  })

  it('resets both dates', () => {
    const { startDate, endDate, reset } = useDateRange()

    startDate.value = '2026-08-01'
    endDate.value = '2026-08-03'
    reset()

    expect(startDate.value).toBe('')
    expect(endDate.value).toBe('')
  })
})
