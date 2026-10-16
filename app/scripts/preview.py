"""Serve an Actions-built site locally, including Astro's extensionless URLs."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        url = urlsplit(self.path)
        if not Path(url.path).suffix:
            html_path = url.path.rstrip("/") + ".html"
            if Path(self.translate_path(html_path)).is_file():
                self.path = urlunsplit(url._replace(path=html_path))
        return super().send_head()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4321)
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parents[1] / "dist")
    args = parser.parse_args()
    output = args.directory.resolve()
    if not (output / "index.html").is_file():
        parser.error("app/dist is missing. Download the local-preview Actions artifact first.")
    handler = partial(PreviewHandler, directory=str(output))
    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        print(f"Preview: http://localhost:{args.port}", flush=True)
        server.serve_forever()
