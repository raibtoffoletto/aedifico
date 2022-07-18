import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
  breakpoints: {
    sm: '480px',
    md: '600px',
    lg: '780px',
    xl: '960px',
  },
  fonts: {
    heading: `Nunito, sans-serif`,
    body: `Ubuntu, sans-serif`,
    mono: `"IBM Plex Mono", mono`,
  },
});
