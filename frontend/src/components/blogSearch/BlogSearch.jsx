import "./BlogSearch.scss";

import React, { useState } from "react";

import { useGetBlogsBySearchQuery } from "../../context/api/blogApi";

const BlogSearch = () => {
  const [search, setSearch] = useState("");
  let { data, isError } = useGetBlogsBySearchQuery({ value: search });
  console.log(data);
  return (
    <div className="blog__search">
      <form action="">
        <input
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"search"}
          value={search}
          type="text"
        />
        <button>Search</button>
      </form>
      {search ? (
        <div className="">
          {isError ? (
            <div className="blog__search__not">Not found</div>
          ) : (
            <div className="blog__search__info">
              {data?.payload?.map((el) => (
                <div className="blog__search__info__frame">
                  <p>{el.title}</p> <p>{el.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BlogSearch;
