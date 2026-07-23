const canonicalOrigin = "https://andriishupta.dev";

export default {
  async fetch(request: Request) {
    const source = new URL(request.url);
    const target = new URL(canonicalOrigin);

    if (source.pathname === "/") {
      target.pathname = "/blog/";
    } else if (source.pathname === "/blog") {
      target.pathname = "/blog";
    } else if (source.pathname.startsWith("/blog/")) {
      target.pathname = source.pathname;
    } else {
      target.pathname = `/blog${source.pathname}`;
    }

    target.search = source.search;

    return new Response(null, {
      status: 301,
      headers: {
        "Cache-Control": "public, max-age=86400",
        Location: target.toString(),
      },
    });
  },
};
