import '../public/styles.css';
import '@fontsource/bad-script/400.css';
import '@fontsource/ibm-plex-mono/100.css';
import '@fontsource/ibm-plex-mono/100-italic.css';
import '@fontsource/ibm-plex-mono/200.css';
import '@fontsource/ibm-plex-mono/200-italic.css';
import '@fontsource/ibm-plex-mono/300.css';
import '@fontsource/ibm-plex-mono/300-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/400-italic.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/500-italic.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-mono/600-italic.css';
import '@fontsource/ibm-plex-mono/700.css';
import '@fontsource/ibm-plex-mono/700-italic.css';
import '@fontsource/nunito/200.css';
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/300-italic.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/400-italic.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/500-italic.css';
import '@fontsource/ubuntu/700.css';
import '@fontsource/ubuntu/700-italic.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../components/theme';

export default function Website({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
