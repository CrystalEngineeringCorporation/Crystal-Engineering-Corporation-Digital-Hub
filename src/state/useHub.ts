import { useContext } from 'react';
import { HubContext, type HubContextValue } from './context';

export function useHub(): HubContextValue {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error('useHub must be used inside <HubProvider>');
  return ctx;
}
