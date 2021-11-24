interface CurrencyFilterOptions {
  locale?: string
  maximumFractionDigits?: number
  minimumFractionDigits?: number
}

const percentageFilter = (value: string | number | null | undefined = '', { locale = 'pt', maximumFractionDigits = 2, minimumFractionDigits = 2 }: CurrencyFilterOptions = {}): string | undefined => {
  value = value ?? null
  if (value === null) return
  else if (typeof value === 'string') value = parseFloat(value)
  if (value === null || isNaN(value)) throw Error(`${value ?? 'value'} is not a valid number`)
  const formatter = new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits, maximumFractionDigits })
  const _value = formatter.format(value)
  return _value
}

export default percentageFilter
