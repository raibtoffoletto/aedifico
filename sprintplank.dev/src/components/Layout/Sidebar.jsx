import {
  Box,
  Flex,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { AppHeading } from './Header';
import Navigation from './Navigation';

export function Sidebar({ isOpen, onClose }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay />
      <DrawerContent p={2} backgroundColor="gray.100" maxWidth={224}>
        <Button
          p={1}
          onClick={onClose}
          position="absolute"
          top={2}
          right={2}
          w={10}
          h={10}
        >
          <CloseIcon w={3} h={3} />
        </Button>
        <Navigation />
      </DrawerContent>
    </Drawer>
  );
}

export function FixedSidebar() {
  return (
    <Box
      shrink={0}
      p={{ base: 0, lg: 2 }}
      width={{ base: 0, lg: 224 }}
      opacity={{ base: 0, lg: 1 }}
      transition="width 150ms ease-in, opacity 150ms ease-in, padding 150ms ease-in"
    >
      <Flex
        overflowX="hidden"
        overflowY="auto"
        direction="column"
        position="fixed"
        width={208}
        pr={2}
        maxHeight="100%"
        gap={2}
      >
        <AppHeading
          mt={{ base: 0, lg: -2 }}
          ml={{ base: 2, lg: 0 }}
          transition="margin-top 150ms ease-in, margin-left 150ms ease-in"
        />
        <Navigation />
      </Flex>
    </Box>
  );
}
