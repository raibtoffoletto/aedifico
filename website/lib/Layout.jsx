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
import { Navigation, Footer } from '../components';

export default function Layout({
  title,
  menu,
  socialMedia,
  footer,
  path,
  children,
}) {
  return (
    <>
      <Navigation
        menu={menu}
        title={title}
        socialMedia={socialMedia}
        path={path}
      />
      <Flex direction="column" width="100%" flexGrow={1} as="main" p={2}>
        {children}
      </Flex>
      <Footer {...footer} socialMedia={socialMedia} />
    </>
  );
}
