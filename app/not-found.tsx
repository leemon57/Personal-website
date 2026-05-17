import Link from "next/link";

export default function NotFound() {
  return (
    <div className="layout">
      <div className="prose">
        <p className="caps">404</p>
        <h1 style={{ marginBottom: "1.5rem" }}>Page not found.</h1>
        <div className="fourohfour">
          <span>{`Traceback (most recent call last):
  File "router.ts", line 42, in <module>
    render(route="/unknown")
  `}</span>
          <span className="c">{`# requested route is not in the manifest`}</span>
          <span>{`
NotFoundError: no page matches the route above.

`}</span>
          <span className="c">{`# suggested recovery:`}</span>
          <span>{`
  > `}</span>
          <Link href="/">start over at home</Link>
        </div>
      </div>
    </div>
  );
}
