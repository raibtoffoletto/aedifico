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

import { useCallback } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { useWindowResizeListener } from '../../lib';
import { Header } from './Header';
import { Sidebar, FixedSidebar } from './Sidebar';

export default function Layout({ children }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  useWindowResizeListener(
    useCallback(() => {
      if (window.innerWidth >= 780) {
        onClose();
      }
    }, [onClose]),
    222
  );

  return (
    <>
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <FixedSidebar />
      <Flex direction="column" grow={1}>
        <Header onOpen={onOpen} />
        <Flex direction="column" grow={1} p={2} gap={2}>
          {children}
        </Flex>
      </Flex>
    </>
  );
}
