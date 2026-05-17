import Image from "next/image";

/**
 * Figure
 *
 * Provides a consistent bordered frame and caption for product screenshots
 * and diagrams embedded from MDX.
 *
 * Used by: MDX content through mdx-components.tsx
 */
export interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export function Figure({ src, alt, caption, width, height }: FigureProps) {
  return (
    <figure className="my-8">
      <Image
        alt={alt}
        className="h-auto rounded-md border border-rule"
        height={height}
        src={src}
        width={width}
      />
      {caption ? (
        <figcaption className="mt-2 font-mono text-[0.8125rem] leading-normal text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
