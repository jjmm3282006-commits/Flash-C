#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

print(f"Starting server on http://localhost:{PORT}")
print(f"Open your browser to: http://localhost:{PORT}/flashcard.html")
print("Press Ctrl+C to stop the server")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        sys.exit(0)
