'use client';

import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('EUR');

  const currencyRates = {
    EUR: { symbol: '€', rate: 1.0 },
    USD: { symbol: '$', rate: 1.08 },
    GBP: { symbol: '£', rate: 0.85 }
  };

  const formatPrice = (amountEUR) => {
    if (!amountEUR && amountEUR !== 0) return '';
    const { symbol, rate } = currencyRates[currency] || currencyRates.EUR;
    const converted = amountEUR * rate;

    if (currency === 'EUR') {
      return `€ ${converted.toFixed(2).replace('.', ',')}`;
    }
    return `${symbol} ${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
