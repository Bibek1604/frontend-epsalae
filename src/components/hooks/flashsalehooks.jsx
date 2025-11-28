// src/hooks/useFlashSales.jsx
import { useEffect } from 'react';
import { useFlashSaleStore } from '../store/flashsalestore';

export const useFlashSales = () => {
  const { flashSales, loading, error, fetchFlashSales } = useFlashSaleStore();

  useEffect(() => {
    if (flashSales.length === 0) fetchFlashSales();
  }, []);

  return { flashSales, loading, error, refetch: fetchFlashSales };
};