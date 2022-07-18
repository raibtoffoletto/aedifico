import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import rmMD from 'remove-markdown';
import { Divider, Flex, Text, Spinner } from '@chakra-ui/react';

const PAGE_SIZE = 5;

function Post({ title, date, content, lng, path }) {
  const { push } = useRouter();

  return (
    <Flex
      width="100%"
      maxWidth="100%"
      flexDirection="column"
      gap={2}
      p={2}
      as="button"
      sx={{
        '&:hover': {
          backgroundColor: 'gray.100',
        },
      }}
      onClick={() => {
        push(path);
      }}
    >
      <Flex justifyContent="space-between" wrap="wrap">
        <Text
          fontSize="1.1rem"
          flexBasis={{ base: '100%', md: 'unset' }}
          align="left"
        >
          {title}
        </Text>

        <Text fontSize="0.875rem" fontWeight={300}>
          {new Date(date).toLocaleString(lng, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </Flex>

      <Text as="div" fontWeight={300} align="left" mt={2}>
        {rmMD(content)}
        {`...`}
      </Text>
    </Flex>
  );
}

export default function PostList({ posts: postList, lng }) {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(postList.slice(0, PAGE_SIZE));
  const [loaderRef, setLoaderRef] = useState(null);

  const isLastPage = useMemo(() => {
    if (!postList?.length) {
      return true;
    }

    const pages = Math.ceil(postList.length / PAGE_SIZE);
    const compare = Number.isNaN(pages) ? 1 : pages;

    return compare === page + 1;
  }, [page, postList]);

  useEffect(() => {
    const handleObserver = (el) => {
      if (!!el?.[0]?.isIntersecting && !!posts?.length && !isLastPage) {
        setTimeout(() => setPage((pg) => pg + 1), 666);
      }
    };

    let _ref;
    const observer = new IntersectionObserver(handleObserver);

    if (!!loaderRef) {
      _ref = loaderRef;

      observer.observe(loaderRef);
    }

    return () => {
      if (!!_ref) {
        observer.unobserve(_ref);
      }
    };
  }, [loaderRef, posts, isLastPage]);

  useEffect(() => {
    setPosts((x) => {
      if (!!postList.length) {
        const slice = postList.slice(
          page * PAGE_SIZE,
          page * PAGE_SIZE + PAGE_SIZE
        );

        if (page === 0) {
          return slice;
        }

        return x.concat(slice);
      }

      return [];
    });
  }, [page, postList]);

  return (
    <Flex
      m={0}
      py={3}
      px={4}
      width="100%"
      maxWidth="100%"
      border="1px solid #ccc"
      borderRadius={8}
      flexDirection="column"
      gap={2}
    >
      {posts.map((post, i) => (
        <>
          <Post key={post?.path} lng={lng} {...post} />
          {i + 1 !== posts.length && <Divider />}
        </>
      ))}

      {!isLastPage && (
        <>
          <Flex
            ref={setLoaderRef}
            height={10}
            alignItems="center"
            justifyContent="center"
          >
            <Spinner size="md" />
          </Flex>
        </>
      )}
    </Flex>
  );
}
