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
