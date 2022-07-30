/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useCallback } from 'react';
import debounce from '../debounce';

export default function useWindowResizeListener(
  callback = () => {},
  delay = 666
) {
  if (!(callback instanceof Function)) {
    return;
  }

  /* eslint-disable-next-line */
  const listener = useCallback(debounce(callback, delay), [callback]);

  useEffect(() => {
    listener();
    window.addEventListener('resize', listener, { passive: false });

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [listener]);
}
