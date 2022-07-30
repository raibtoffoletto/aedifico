/**
 * Copyright 2019 ~ 2022 Raí B. Toffoletto (https://toffoletto.me)
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301 USA
 *
 * Authored by: Raí B. Toffoletto <rai@toffoletto.me>
 */

import { useState, useMemo, useEffect, Fragment } from 'react';
import rmMD from 'remove-markdown';
import { Divider, Flex, Text, Spinner } from '@chakra-ui/react';

const PAGE_SIZE = 5;

function Post({ title, date, content, lng, path }) {
  return (
    <Flex
      width="100%"
      maxWidth="100%"
      flexDirection="column"
      gap={2}
      p={2}
      as="a"
      href={path}
      sx={{
        '&:hover, &:focus': {
          backgroundColor: 'gray.100',
        },
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

    return compare <= page + 1;
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
        <Fragment key={post?.path}>
          <Post lng={lng} {...post} />
          {i + 1 !== posts.length && <Divider />}
        </Fragment>
      ))}

      {!isLastPage && (
        <>
          <Flex
            ref={setLoaderRef}
            height={10}
            alignItems="center"
            justifyContent="center"
            tabIndex={0}
            role="progressbar"
            aria-label="loading more"
          >
            <Spinner size="md" />
          </Flex>
        </>
      )}
    </Flex>
  );
}
