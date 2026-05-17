import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-shell">
      <div className="content-column py-16">
        <pre className="overflow-x-auto rounded-md border border-rule bg-surface p-6 font-mono text-[0.8125rem] leading-6 text-ink-muted">
          {`Traceback (most recent call last):
  File "hanyjiang.com/router", line 404, in resolve
    raise PageNotFound(path)

PageNotFound: page not found`}
        </pre>
        <p className="mt-6 font-mono text-[0.8125rem]">
          <Link href="/">start over at home</Link>
        </p>
      </div>
    </div>
  );
}
