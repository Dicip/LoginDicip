const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 5001;

const server = http.createServer((req, res) => {
  // Parsear la URL
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;
  
  // Mapear URLs a archivos
  if (pathname === './') {
    pathname = './index.html';
  } else if (pathname === './registro') {
    pathname = './registro.html';
  }

  // Obtener extensión del archivo
  const ext = path.parse(pathname).ext;
  
  // Tipos MIME
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  // Verificar si el archivo existe
  fs.exists(pathname, (exist) => {
    if (!exist) {
      // Archivo no encontrado
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    // Leer y servir el archivo
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading file: ${err}`);
      } else {
        // Establecer el tipo de contenido basado en la extensión
        res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
        res.end(data);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});