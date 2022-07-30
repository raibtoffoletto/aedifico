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

import { Flex, Heading, Button } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

export function AppHeading({ ...props }) {
  return (
    <Heading
      height={12}
      lineHeight="48px"
      px={2}
      fontSize="1.5rem"
      whiteSpace="nowrap"
      {...props}
    >
      Sprintplank
    </Heading>
  );
}

export function Header({ onOpen }) {
  return (
    <Flex
      alignItems="center"
      px={2}
      gap={0}
      height={{ base: 12, lg: 0 }}
      opacity={{ base: 1, lg: 0 }}
      transition="height 150ms ease-in, opacity 150ms ease-in"
    >
      <Button p={2} onClick={onOpen}>
        <HamburgerIcon w={5} h={5} />
      </Button>
      <AppHeading />
    </Flex>
  );
}
