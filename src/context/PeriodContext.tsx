import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Period { label: string; days: number; }

interface PeriodCtx {
  period: Period;
  setPeriod: (p: Period) => void;
}

const PeriodContext = createContext<PeriodCtx>({
  period: { label: '30D', days: 30 },
  setPeriod: () => {},
});

export const usePeriod = () => useContext(PeriodContext);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>({ label: '30D', days: 30 });
  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  );
}
