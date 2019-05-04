#! /usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import sys

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

httpd = HTTPServer(('127.0.0.1', 8000), CORSRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               certfile=sys.argv[1],
                               keyfile=sys.argv[2],
                               server_side=True)
httpd.serve_forever()
