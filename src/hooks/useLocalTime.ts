import { useEffect, useState } from 'react';

function read(timeZone: string) {
  const now = new Date();
  return {
    time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(now),
    hour: Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(now)),
  };
}

/** Wall-clock time somewhere else, refreshed every 15s. */
export function useLocalTime(timeZone: string) {
  const [state, setState] = useState(() => read(timeZone));

  useEffect(() => {
    const id = setInterval(() => setState(read(timeZone)), 15_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return state;
}
