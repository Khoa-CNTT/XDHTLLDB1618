import { useState } from 'react'
import { addMonths, isAfter } from 'date-fns'
import { DateRange } from 'react-day-picker'

export const useRecurringSchedule = () => {
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringType, setRecurringType] = useState('weekly')
  const [recurringDays, setRecurringDays] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [dateRangeOpen, setDateRangeOpen] = useState(false)

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      if (!range.to) {
        setDateRange(range)
      } else if (range.to) {
        const maxEndDate = addMonths(range.from, 1)
        if (isAfter(range.to, maxEndDate)) {
          setDateRange({
            from: range.from,
            to: maxEndDate
          })
        } else {
          setDateRange(range)
        }
      }
    } else {
      setDateRange(undefined)
    }
  }

  const clearRecurringSchedule = () => {
    setIsRecurring(false)
    setRecurringType('weekly')
    setRecurringDays([])
    setDateRange(undefined)
    setDateRangeOpen(false)
  }

  return {
    isRecurring,
    setIsRecurring,
    recurringType,
    setRecurringType,
    recurringDays,
    setRecurringDays,
    dateRange,
    dateRangeOpen,
    setDateRangeOpen,
    handleDateRangeSelect,
    clearRecurringSchedule
  }
}
