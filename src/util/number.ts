export const currencyFormatter = (
  locale: Intl.LocalesArgument,
  currency: string | undefined
) =>
  Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });
