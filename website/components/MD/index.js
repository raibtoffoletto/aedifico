import { Prism } from 'react-syntax-highlighter';
import {
  Heading,
  Text,
  Link,
  Kbd,
  ListItem,
  Container,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react';

const indent = 'min(5vw, 50px)';

export const p = (props) => (
  <Text
    {...props}
    sx={{
      my: 2,
      fontWeight: 300,
      textAlign: 'justify',
      textIndent: indent,
    }}
  />
);

export const h1 = (props) => (
  <Heading {...props} as={'h2'} size="lg" my={4} fontWeight={300} ml={indent} />
);

export const h2 = (props) => (
  <Heading {...props} as={'h2'} size="md" my={4} fontWeight={500} ml={indent} />
);

export const h3 = (props) => (
  <Heading {...props} as={'h3'} size="md" my={4} fontWeight={300} ml={indent} />
);

export const h4 = h3;

export const h5 = (props) => (
  <Heading {...props} as={'h5'} size="1rem" mb={1} mt={3.5} ml={indent} />
);

export const h6 = h5;

export const a = ({ props }) => (
  <Link {...props} color="blue.600" fontWeight={500} />
);

export const pre = ({ children }) => {
  if (children?.type?.name === 'code') {
    return (
      <Prism
        codeTagProps={{
          style: {
            fontFamily: `"IBM Plex Mono", mono`,
            lineHeight: 1.75,
          },
        }}
        language={
          `${children?.props?.className}`?.split?.('-')?.[1] ?? 'javascript'
        }
        showLineNumbers
        wrapLongLines
      >
        {children?.props?.children}
      </Prism>
    );
  }

  return <pre>{children}</pre>;
};

export const ul = (props) => <UnorderedList {...props} ml={indent} my={4} />;

export const ol = (props) => <OrderedList {...props} ml={indent} my={4} />;

export const li = (props) => <ListItem {...props} my={1.5} fontWeight={300} />;

export const code = (props) => <Kbd {...props} fontSize="1rem" />;

export const blockquote = (props) => (
  <Container
    {...props}
    sx={{
      py: 2,
      px: 4,
      my: 4,
      mx: indent,
      maxWidth: `calc(100% - calc(${indent} * 2))`,
      border: '1px solid #ccc',
      borderRadius: 8,
      fontFamily: '"Bad Script", cursive',
      fontSize: '1.25rem',
    }}
  />
);

export { default as Empty } from './Empty';
