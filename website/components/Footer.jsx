import { Flex, Text, Link } from '@chakra-ui/react';
import Social from './Social';

export default function Navigation({ text, caption, socialMedia }) {
  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      as="footer"
      flexDirection="column"
      gap={2}
      mt={4}
    >
      <Social links={socialMedia} showOnMobile />
      <Text fontSize="sm">
        {text}
        {` Build with ❤️ and `}
        <Link
          href="https://github.com/raibtoffoletto/aedifico"
          target="_blank"
          color="blue.600"
          fontWeight={500}
        >
          Aedifico
        </Link>
        .
      </Text>
      {!!caption && <Text fontSize="xs">{caption}</Text>}
    </Flex>
  );
}
