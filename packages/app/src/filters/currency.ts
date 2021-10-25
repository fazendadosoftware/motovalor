interface CurrencyFilterOptions {
  locale?: string
  currency?: string
  showZero?: boolean
  maximumFractionDigits?: number
}

const currencyFilter = (value: string | number | null | undefined = '', { locale = 'pt-BR', currency = 'BRL', showZero = false, maximumFractionDigits = 0 }: CurrencyFilterOptions = {}): string | undefined => {
  value = value ?? ''
  if (value === '' && !showZero) return
  else if (typeof value === 'string') value = parseFloat(value)
  if (isNaN(value)) throw Error(`${value} is not a valid number`)
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits }).format(value)
}

export default currencyFilter
