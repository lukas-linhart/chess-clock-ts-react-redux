import { Store } from 'redux';
import { tick } from './actions';
import { TICK_INTERVAL } from '../constants';
import { clock$ } from '.';

export const clockTimerSubscription = (store: Store, timestampFunc = Date.now) => {
  let ticker: any;
  let isRunning: boolean;
  const unsubscribe = store.subscribe(() => {
    const wasRunning = isRunning;
    isRunning = clock$(store.getState()) === 'running';
    const shouldStart = !wasRunning && isRunning;
    const shouldEnd = wasRunning && !isRunning;

    if (shouldStart) {
      ticker = setInterval(
        () => store.dispatch(tick(timestampFunc)),
        TICK_INTERVAL,
      );
    }

    if (shouldEnd) {
      clearInterval(ticker);
    }
  });
  return unsubscribe;
};
