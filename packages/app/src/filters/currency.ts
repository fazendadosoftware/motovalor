interface CurrencyFilterOptions {
  locale?: string
  currency?: string
  showZero?: boolean
  maximumFractionDigits?: number
  minimumFractionDigits?: number
}

const currencyFilter = (value: string | number | null | undefined = '', { locale = 'pt', currency = 'BRL', showZero = false, maximumFractionDigits = 0, minimumFractionDigits = 0 }: CurrencyFilterOptions = {}): string | undefined => {
  value = value ?? null
  if (value === null && !showZero) return
  else if (typeof value === 'string') value = parseFloat(value)
  if (value === null || isNaN(value)) throw Error(`${value ?? 'value'} is not a valid number`)
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits, maximumFractionDigits })
  const _value = formatter.format(value)
  return _value
}

export default currencyFilter
