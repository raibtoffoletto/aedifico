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

function Spacer({ ...props }) {
  return (
    <Box
      borderLeft="1px solid #ccc"
      height={8}
      mx={'7px'}
      flexShrink={0}
      {...props}
    />
  );
}

function Chevron({ open }) {
  return (
    <ListIcon
      as={open ? ChevronDownIcon : ChevronRightIcon}
      color="gray.500"
      mr={1}
    />
  );
}

function ListMenuHeader({ ...props }) {
  return (
    <ListItem
      as="button"
      display="flex"
      alignItems="center"
      role="menuitem"
      width="100%"
      {...props}
      sx={{ '&:hover, &:focus': { backgroundColor: 'gray.100' }, ...props?.sx }}
    />
  );
}

function ListMenuCollapsable({ open, label, ...props }) {
  return (
    <Collapse
      in={open}
      role="menu"
      aria-hidden={!open ? 'true' : undefined}
      aria-label={label}
      {...props}
    />
  );
}

function PostLink({ path, label }) {
  return (
    <>
      <ListItem
        display="flex"
        alignItems="center"
        as="a"
        role="menuitem"
        href={path}
        gap={'4px'}
        maxWidth="100%"
        sx={{
          '&:hover, &:focus': {
            backgroundColor: 'gray.100',
          },
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

  const _month = useMemo(
    () => new Date(`2000-${month}-01`).toLocaleString(lng, { month: 'long' }),
    [lng, month]
  );

  return (
    <>
      <ListMenuHeader onClick={onToggle}>
        <Spacer />
        <Chevron open={isOpen} />
        {_month}
      </ListMenuHeader>

      <ListMenuCollapsable open={isOpen} label={_month}>
        {Object.keys(posts).map((path) => (
          <PostLink key={path} path={path} label={posts[path]} />
        ))}
      </ListMenuCollapsable>
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
      <ListMenuHeader height={8} onClick={onToggle}>
        <Chevron open={isOpen} />
        {year}
      </ListMenuHeader>

      <ListMenuCollapsable open={isOpen} label={year}>
        {months.map((month) => (
          <Month key={month} month={month} posts={_months[month]} lng={lng} />
        ))}
      </ListMenuCollapsable>
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
        fontWeight={300}
        color="gray.600"
        letterSpacing="0.1rem"
        align="center"
      >
        {title}
      </Text>
      <List role="menu" as="div" display="flex" flexDirection="column">
        {years.map((year) => (
          <Year key={year} year={year} months={postTree[year]} lng={lng} />
        ))}
      </List>
    </>
  );
}
