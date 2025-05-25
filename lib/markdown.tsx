import Pre from "@/components/markdown/pre";
import React, { ComponentProps, memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preProcess = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl.tagName !== "code") return;
      node.raw = codeEl.children?.[0].value;
      const meta = codeEl.data?.meta;
      if (meta && typeof meta === "string") {
        const fileMatch = meta.match(/title=([\w./-]+)/);
        if (fileMatch) {
          node.filename = fileMatch[1];
        }
      }
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postProcess = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      node.properties["raw"] = node.raw;
      node.properties["filename"] = node.filename;
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeLanguage = () => (tree: any) => {
  const supported = new Set([
    "js",
    "ts",
    "tsx",
    "jsx",
    "html",
    "css",
    "json",
    "bash",
    "python",
    "c",
    "cpp",
    "java",
  ]);

  visit(tree, "element", (node) => {
    if (node.tagName === "code" && node.properties?.className) {
      const classNames = node.properties.className;
      const langClass = classNames.find((c: string) =>
        c.startsWith("language-")
      );

      if (langClass) {
        const lang = langClass.replace("language-", "");
        if (!supported.has(lang)) {
          // fallback to plain text if unsupported
          node.properties.className = ["language-text"];
        }
      }
    }
  });
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    pre: Pre,
    code: ({ className, children, ...props }: ComponentProps<"code">) => {
      return (
        <code
          className={`${className} text-sm  py-0.5 px-1 rounded  border`}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        preProcess,
        normalizeLanguage,
        rehypePrism,
        postProcess,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

export async function getToc(content: string) {
  const headingsRegex = /^(#{2,4})\s(.+)$/gm;
  let match;
  const extractedHeadings = [];
  while ((match = headingsRegex.exec(content)) !== null) {
    const headingLevel = match[1].length;
    const headingText = match[2].trim();
    const slug = getSlug(headingText);
    extractedHeadings.push({
      level: headingLevel,
      text: headingText,
      href: `#${slug}`,
    });
  }
  return extractedHeadings;
}

function getSlug(text: string) {
  const slug = text.toLowerCase().replace(/\s+/g, "-");
  return slug.replace(/[^a-z0-9-]/g, "");
}
