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

import { Flex } from '@chakra-ui/react';
import { SocialIcon, keyFor } from 'react-social-icons';
import networks from 'react-social-icons/build/_networks-db';

export default function Social({ showOnMobile, links }) {
  const sizes = showOnMobile
    ? { width: 24, height: 24 }
    : { width: 32, height: 32 };
  return (
    <Flex
      display={
        showOnMobile
          ? { base: 'flex', md: 'none' }
          : { base: 'none', md: 'flex' }
      }
      mb={showOnMobile ? 2 : undefined}
      gap={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        '& a': {
          '& .social-svg-mask': {
            opacity: 0.5,
            transition:
              'opacity 170ms ease-in-out, fill 170ms ease-in-out !important',
            fill: '#778 !important',
          },

          '&:hover, &:focus': {
            '& .social-svg-mask': {
              opacity: 1,
              fill: 'inherit !important',
            },
          },
        },
      }}
    >
      {links?.map?.((url) => {
        return (
          <SocialIcon
            key={url}
            url={url}
            style={{
              color: networks?.[keyFor(url)]?.color,
              fill: networks?.[keyFor(url)]?.color,
              ...sizes,
            }}
          />
        );
      })}
    </Flex>
  );
}
