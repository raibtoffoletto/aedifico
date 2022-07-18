import { useMemo } from 'react';
import {
  List,
  ListIcon,
  ListItem,
  Collapse,
  useDisclosure,
  Box,
  Text,
} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const Spacer = ({ ...props }) => (
  <Box
    borderLeft="1px solid #ccc"
    height={8}
    mx={'7px'}
    flexShrink={0}
    {...props}
  />
);

function PostLink({ path, label }) {
  const { push } = useRouter();

  return (
    <>
      <ListItem
        display="flex"
        alignItems="center"
        as="button"
        gap={'4px'}
        maxWidth="100%"
        sx={{
          '&:hover': {
            backgroundColor: 'gray.100',
          },
        }}
        onClick={() => {
          push(path);
        }}
      >
        <Spacer width={3} />
        <Text
          fontWeight={300}
          align="left"
          overflow="hidden"
          width={'180px'}
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {label}
        </Text>
      </ListItem>
    </>
  );
}

function Month({ month, posts, lng }) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <ListItem
        display="flex"
        alignItems="center"
        as="button"
        width="100%"
        sx={{ '&:hover': { backgroundColor: 'gray.100' } }}
        onClick={onToggle}
      >
        <Spacer />
        <ListIcon
          as={isOpen ? ChevronDownIcon : ChevronRightIcon}
          color="gray.500"
          mr={1}
        />
        {new Date(`2000-${month}-01`).toLocaleString(lng, { month: 'long' })}
      </ListItem>

      <Collapse in={isOpen}>
        {Object.keys(posts).map((path) => (
          <PostLink key={path} path={path} label={posts[path]} />
        ))}
      </Collapse>
    </>
  );
}

function Year({ year, months: _months, lng }) {
  const { isOpen, onToggle } = useDisclosure();

  const months = useMemo(() => {
    const keys = Object.keys(_months ?? {});
    keys.sort((a, b) => Number(b) - Number(a));

    return keys;
  }, [_months]);

  return (
    <>
      <ListItem
        display="flex"
        alignItems="center"
        as="button"
        height={8}
        width="100%"
        sx={{
          '&:hover': {
            backgroundColor: 'gray.100',
          },
        }}
        onClick={onToggle}
      >
        <ListIcon
          as={isOpen ? ChevronDownIcon : ChevronRightIcon}
          color="gray.500"
          mr={1}
        />
        {year}
      </ListItem>

      <Collapse in={isOpen}>
        {months.map((month) => (
          <Month key={month} month={month} posts={_months[month]} lng={lng} />
        ))}
      </Collapse>
    </>
  );
}

export default function PostArchive({ postTree, lng, title }) {
  const years = useMemo(() => {
    const keys = Object.keys(postTree ?? {});
    keys.sort((a, b) => Number(b) - Number(a));

    return keys;
  }, [postTree]);

  return (
    <>
      <Text
        fontSize="1rem"
        textTransform="uppercase"
        fontWeight={100}
        color="gray.500"
        letterSpacing="0.1rem"
        align="center"
      >
        {title}
      </Text>
      <List as="div" display="flex" flexDirection="column">
        {years.map((year) => (
          <Year key={year} year={year} months={postTree[year]} lng={lng} />
        ))}
      </List>
    </>
  );
}
