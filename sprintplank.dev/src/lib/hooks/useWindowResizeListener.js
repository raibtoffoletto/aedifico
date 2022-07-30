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
 */

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
