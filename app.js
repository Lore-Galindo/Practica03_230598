const express = require('express');
const session = require('express-session');

const app = express();

// Configuración de la sesión
app.use(session({
    secret: 'mi-clave-secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware para mostrar detalles de la sesión
app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.createdAt) {
            req.session.createdAt = new Date();
        }
        req.session.lastAcces = new Date();
    }
    next();
});

// Ruta para mostrar la información de la sesión
app.get('/session/:nombre', (req, res) => {
    if (req.session) {
        const sessionId = req.session.id;
        const createdAt = req.session.createdAt;
        const lastAcces = req.session.lastAcces;
        const sessionDuration = (new Date() - createdAt) / 1000;
        const nombre1 = req.params.nombre;

        res.send(`
        <h1>Detalles de la sesión</h1>
        <p><strong>Id de la sesión:</strong> ${sessionId}</p>
        <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
        <p><strong>Último acceso:</strong> ${lastAcces}</p>
        <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
        <p><strong>Nombre de quien inició sesión:</strong> ${nombre1}</p>
        `);
    } else {
        res.send('No hay sesión activa');
    }
});

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error al cerrar sesión.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});


