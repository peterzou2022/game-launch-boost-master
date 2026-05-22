import http.server
import os
from urllib.parse import unquote, urlparse


ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), "out")


class ExportPreviewHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        full_path = os.path.join(ROOT, path.lstrip("/"))

        if path.endswith("/"):
            index_file = os.path.join(ROOT, path.lstrip("/"), "index.html")
            if os.path.isfile(index_file):
                self.path = path + "index.html" if not path.endswith("index.html") else path
        elif os.path.isfile(full_path + ".html"):
            self.path = path + ".html"
        elif os.path.isfile(os.path.join(full_path, "index.html")):
            self.path = path.rstrip("/") + "/index.html"

        return super().do_GET()


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 3000), ExportPreviewHandler)
    print("Preview server running at http://127.0.0.1:3000")
    server.serve_forever()
