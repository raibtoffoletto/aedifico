import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Link,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronRightIcon } from '@chakra-ui/icons';

import Social from './Social';

function NavLink({ isActive, isMobile, url, external, label }) {
  const styles = !isMobile
    ? {
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-7px',
          left: '-20%',
          width: '140%',
          height: '1px',
          backgroundColor: isActive ? 'blue.600' : '#333',
          opacity: 1,
          transition: 'opacity 300ms, transform 300ms',
          transform: `scale(${isActive ? 1 : 0})`,
          transformOrigin: 'center',
        },

        '&:hover, &:focus': {
          color: '#333',
        },

        '&:hover::after, &:focus::after': {
          textDecoration: 'none !important',
          transform: 'scale(1)',
        },
      }
    : {
        py: 2,
        px: 4,
        display: 'flex',
        alignItems: 'center',

        '&:hover, &:focus': {
          backgroundColor: 'gray.200',
        },
      };

  return (
    <ListItem>
      <Link
        href={`/${url}`}
        isExternal={!!external}
        sx={{
          color: isActive ? 'blue.600' : 'gray.600',
          textDecoration: 'none !important',
          position: 'relative',
          ...styles,
        }}
      >
        {isMobile && <ChevronRightIcon />}
        {label}
      </Link>
    </ListItem>
  );
}

function NavList({ menu, selected, isMobile }) {
  return (
    <List
      role="navigation"
      sx={
        isMobile
          ? {
              display: { base: 'flex', md: 'none' },
              p: 0,
              gap: 0,
              mb: 4,
              flexDirection: 'column',
              backgroundColor: 'gray.100',
            }
          : {
              display: { base: 'none', md: 'flex' },
              px: 3,
              pb: 1,
              gap: 4,
              borderBottom: '#ccc 1px solid',
            }
      }
    >
      {menu?.map?.((m) => (
        <NavLink
          key={m.url}
          isMobile={isMobile}
          isActive={selected === m.url}
          {...m}
        />
      ))}
    </List>
  );
}

function DrawerToggle({ isOpen, onToggle }) {
  return (
    <Flex display={{ base: 'flex', md: 'none' }}>
      <IconButton
        onClick={onToggle}
        icon={
          isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
        }
        variant={'ghost'}
        aria-label={'Toggle Navigation'}
      />
    </Flex>
  );
}

export default function Navigation({ title, menu, socialMedia }) {
  const { asPath } = useRouter();
  const [selected, setSelected] = useState(undefined);
  const { isOpen, onToggle } = useDisclosure();

  const path = asPath.split?.('/')?.filter?.(Boolean)?.[0];

  useEffect(() => {
    setSelected(path);
  }, [path]);

  return (
    <Flex
      my={{ base: 0, sm: 2, md: 4 }}
      direction="column"
      width="100%"
      as="nav"
      gap={4}
    >
      <Flex justifyContent="space-between" width="100%" px={2}>
        <Heading as="p" size="xl">
          {title}
        </Heading>
        <Social links={socialMedia} />
        <DrawerToggle isOpen={isOpen} onToggle={onToggle} />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <NavList menu={menu} selected={selected} isMobile />
      </Collapse>

      <NavList menu={menu} selected={selected} />
    </Flex>
  );
}
