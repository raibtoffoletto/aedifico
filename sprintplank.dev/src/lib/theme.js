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

import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
  colors: {
    primary: {
      main: '#682860',
      50: '#f9f6f9',
      100: '#e7dde6',
      200: '#d3c0d0',
      300: '#ba9db7',
      400: '#ac89a8',
      500: '#9a6f95',
      600: '#8a5984',
      700: '#794072',
      800: '#6e3066',
      900: '#52204c',
    },
    secondary: {
      main: '#7bb9e8',
      50: '#f2f8fd',
      100: '#cbe3f6',
      200: '#9dcbee',
      300: '#72acd8',
      400: '#669ac1',
      500: '#5682a2',
      600: '#496d89',
      700: '#3a586e',
      800: '#314a5d',
      900: '#233543',
    },
  },
  breakpoints: {
    sm: '480px',
    md: '600px',
    lg: '780px',
    xl: '960px',
    xxl: '960px',
  },
  fonts: {
    heading: `Nunito, sans-serif`,
    body: `Ubuntu, sans-serif`,
    mono: `"IBM Plex Mono", mono`,
  },
});
