'use client';
import { createContext, useContext } from 'react';
const CurrencyContext = createContext();
export function CurrencyProvider({ children }) {
  const formatPrice = value => typeof value === 'number' && Number.isFinite(value) ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(value) : '';
  return <CurrencyContext.Provider value={{ currency: 'EUR', setCurrency: () => {}, formatPrice }}>{children}</CurrencyContext.Provider>;
}
export function useCurrency() { return useContext(CurrencyContext); }
