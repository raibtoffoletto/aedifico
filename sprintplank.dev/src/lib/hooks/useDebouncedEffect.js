/**
 * Copyright 2019 ~ 2022 Raí B. Toffoletto (https://toffoletto.me)
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301 USA
 *
 * Authored by: Raí B. Toffoletto <rai@toffoletto.me>

 * Originally written by Todd Skelton
 * https://stackoverflow.com/users/1212994/todd-skelton
 * https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook/54666498
 *
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
