const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const sql = require('mssql');
const bodyParser = require('body-parser');

// Configuración de la base de datos
const config = {
    user: 'tu_usuario',
    password: 'tu_contraseña',
    server: 'localhost',
    database: 'ClinicaVeterinaria',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const server = http.createServer(async (req, res) => {
    // Middleware para parsear el body
    bodyParser.json()(req, res, async () => {
        if (req.method === 'POST' && req.url === '/registro') {
            try {
                const { nombre, email, usuario, password } = req.body;
                
                // Validación básica
                if (!nombre || !email || !usuario || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Todos los campos son requeridos' }));
                }

                // Hash de la contraseña
                const hashedPassword = await bcrypt.hash(password, 10);

                // Conexión a la base de datos
                await sql.connect(config);
                const result = await sql.query`
                    INSERT INTO dbo.Clientes (Nombre, Email, Usuario, Contraseña)
                    VALUES (${nombre}, ${email}, ${usuario}, ${hashedPassword})
                `;

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Usuario registrado exitosamente' }));
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al registrar el usuario' }));
            }
        } else {
            // Lógica original para servir archivos estáticos
            // ... (mantén el código existente para manejar GET requests)
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});