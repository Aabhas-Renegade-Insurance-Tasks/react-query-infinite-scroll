import React from "react";
import styles from "../styles/Home.module.css";
import { useInfiniteQuery } from "react-query";

export default function Home() {
  const fetchPosts = ({ pageParam = 0 }) =>
    fetch("/api/posts?cursor=" + pageParam).then((res) => res.json());

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("posts", fetchPosts, {
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.data.map((post, key) => (
            <div key={key}>
              <h3>
                {post.id}. {post.title}
              </h3>
              <p>{post.body}</p>
            </div>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
