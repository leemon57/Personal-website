import type { AnchorHTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/CodeBlock";
import { Figure } from "@/components/Figure";

function MdxAnchor({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = typeof href === "string" && /^https?:\/\//u.test(href);

  return (
    <a href={href} {...props}>
      {children}
      {isExternal ? " ↗" : null}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  a: MdxAnchor,
  pre: CodeBlock as MDXComponents["pre"],
  Figure,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
