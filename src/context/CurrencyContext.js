'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const DEFAULT_RATES = {
  EUR: 1,
  NGN: 1650
};

export const AVAILABLE_CURRENCIES = [
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'NGN', label: 'NGN (₦)', symbol: '₦' }
];

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState('EUR');
  const [rates] = useState(DEFAULT_RATES);

  // Initialize currency from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tj_currency');
      if (saved && (saved === 'EUR' || saved === 'NGN')) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const setCurrency = (newCurrency) => {
    if (newCurrency === 'EUR' || newCurrency === 'NGN') {
      setCurrencyState(newCurrency);
      try {
        localStorage.setItem('tj_currency', newCurrency);
      } catch {
        // Ignore
      }
    }
  };

  /**
   * Convert an amount in EUR to the target currency (or active currency).
   */
  const convertPrice = (valueInEUR, targetCurrency = currency) => {
    if (typeof valueInEUR !== 'number' || !Number.isFinite(valueInEUR)) return 0;
    if (targetCurrency === 'NGN') {
      return Math.round(valueInEUR * (rates.NGN || 1650));
    }
    return Number(valueInEUR.toFixed(2));
  };

  /**
   * Format an amount in EUR into the localized currency string (EUR or NGN).
   */
  const formatPrice = (valueInEUR, targetCurrency = currency) => {
    if (typeof valueInEUR !== 'number' || !Number.isFinite(valueInEUR)) return '';

    if (targetCurrency === 'NGN') {
      const converted = convertPrice(valueInEUR, 'NGN');
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(converted);
    }

    // Default: EUR
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: valueInEUR % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(valueInEUR);
  };

  const currencySymbol = currency === 'NGN' ? '₦' : '€';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        currencySymbol,
        rates,
        availableCurrencies: AVAILABLE_CURRENCIES
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'EUR',
      setCurrency: () => {},
      formatPrice: (v) => (typeof v === 'number' ? `€${v}` : ''),
      convertPrice: (v) => v || 0,
      currencySymbol: '€',
      rates: DEFAULT_RATES,
      availableCurrencies: AVAILABLE_CURRENCIES
    };
  }
  return context;
}
