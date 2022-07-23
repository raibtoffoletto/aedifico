import { Flex } from '@chakra-ui/react';
import { SocialIcon, keyFor } from 'react-social-icons';
import networks from 'react-social-icons/build/_networks-db';

export default function Social({ showOnMobile, links }) {
  const sizes = showOnMobile
    ? { width: 24, height: 24 }
    : { width: 32, height: 32 };
  return (
    <Flex
      display={
        showOnMobile
          ? { base: 'flex', md: 'none' }
          : { base: 'none', md: 'flex' }
      }
      mb={showOnMobile ? 2 : undefined}
      gap={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        '& a': {
          '& .social-svg-mask': {
            opacity: 0.5,
            transition:
              'opacity 170ms ease-in-out, fill 170ms ease-in-out !important',
            fill: '#778 !important',
          },

          '&:hover, &:focus': {
            '& .social-svg-mask': {
              opacity: 1,
              fill: 'inherit !important',
            },
          },
        },
      }}
    >
      {links?.map?.((url) => {
        return (
          <SocialIcon
            key={url}
            url={url}
            style={{
              color: networks?.[keyFor(url)]?.color,
              fill: networks?.[keyFor(url)]?.color,
              ...sizes,
            }}
          />
        );
      })}
    </Flex>
  );
}
