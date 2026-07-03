import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import type { Value } from 'react-multi-date-picker'

interface Props {
  value: string
  onChange: (iso: string) => void
  placeholder?: string
  style?: React.CSSProperties
}

export default function PersianDatePicker({ value, onChange, placeholder = 'انتخاب تاریخ', style }: Props) {
  const dateValue: Value = value ? new Date(value) : null

  return (
    <DatePicker
      value={dateValue}
      onChange={(date) => {
        if (!date) { onChange(''); return }
        const d = Array.isArray(date) ? date[0] : date
        onChange(d ? d.toDate().toISOString() : '')
      }}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '.6rem .8rem',
        border: '1.5px solid #E2E8F0',
        borderRadius: 8,
        fontFamily: 'Vazirmatn, sans-serif',
        fontSize: '.9rem',
        direction: 'rtl',
        cursor: 'pointer',
        ...style,
      }}
      containerStyle={{ width: '100%' }}
      inputClass="persian-dp-input"
    />
  )
}
