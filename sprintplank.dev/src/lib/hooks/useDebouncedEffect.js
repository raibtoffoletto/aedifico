/**
 * Originally written by Todd Skelton
 * https://stackoverflow.com/users/1212994/todd-skelton
 * https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook/54666498
 */
import { useCallback, useEffect } from 'react';

export default function useDebouncedEffect(effect, deps, delay = 666) {
  const callback = useCallback(effect, [...deps]); // eslint-disable-line

  useEffect(() => {
    let cleanUp;

    const handler = setTimeout(() => {
      cleanUp = callback();
    }, delay);

    return () => {
      cleanUp?.();

      clearTimeout(handler);
    };
  }, [callback, delay]);
}
