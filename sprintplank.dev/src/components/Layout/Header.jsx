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
