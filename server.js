const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const sql = require('mssql');
const bcrypt = require('bcrypt');

const port = 5001;

// Configuración de la base de datos
const dbConfig = {
    user: 'sa',
    password: '12345',
    server: 'DITZ-23-DIEGO-A\\SQLEXPRESS,1433',
    database: 'ClinicaVeterinaria',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = `.${parsedUrl.pathname}`;

    // Manejar POST para registro
    if (req.method === 'POST' && parsedUrl.pathname === '/registro') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { nombre, email, usuario, password } = JSON.parse(body);
                
                // Validaciones básicas
                if (!nombre || !email || !usuario || !password) {
                    sendResponse(res, 400, { error: 'Todos los campos son requeridos' });
                    return;
                }

                // Hash de la contraseña
                const hashedPassword = await bcrypt.hash(password, 10);

                // Conexión a DB
                await sql.connect(dbConfig);
                const result = await sql.query`
                    INSERT INTO dbo.Clientes (Nombre, Email, Usuario, Contraseña)
                    VALUES (${nombre}, ${email}, ${usuario}, ${hashedPassword})
                `;

                sendResponse(res, 201, { message: 'Usuario registrado exitosamente' });
            } catch (error) {
                console.error('Error:', error);
                const message = error.number === 2627 ? 'El email o usuario ya existe' : 'Error en el servidor';
                sendResponse(res, 500, { error: message });
            }
        });
    } else {
        // Servir archivos estáticos
        handleStaticFiles(req, res, parsedUrl, pathname);
    }
});

function sendResponse(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

async function handleStaticFiles(req, res, parsedUrl, pathname) {
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png'
    };

    try {
        const content = await fs.promises.readFile(pathname);
        const ext = path.parse(pathname).ext;
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(content);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 No encontrado</h1>');
    }
}

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});