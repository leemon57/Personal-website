import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/mdx-components";
import { Prose } from "@/components/Prose";

/**
 * MdxRenderer
 *
 * Compiles trusted local MDX source and wraps it in the site prose styles.
 *
 * Used by: dynamic work routes
 */
export interface MdxRendererProps {
  source: string;
}

export async function MdxRenderer({ source }: MdxRendererProps) {
  const evaluated = await evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  const Content = evaluated.default;

  return (
    <Prose>
      <Content components={mdxComponents} />
    </Prose>
  );
}
