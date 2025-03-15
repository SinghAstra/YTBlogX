"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

const MDXSource = ({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) => {
  console.log("mdxSource", mdxSource);

  return <MDXRemote {...mdxSource} />;
};

export default MDXSource;
