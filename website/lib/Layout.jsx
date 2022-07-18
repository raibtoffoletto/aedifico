import { Flex } from '@chakra-ui/react';
import { Navigation, Footer } from '../components';

export default function Layout({ title, menu, socialMedia, footer, children }) {
  return (
    <>
      <Navigation menu={menu} title={title} socialMedia={socialMedia} />
      <Flex direction="column" width="100%" flexGrow={1} as="main" p={2}>
        {children}
      </Flex>
      <Footer {...footer} socialMedia={socialMedia} />
    </>
  );
}
