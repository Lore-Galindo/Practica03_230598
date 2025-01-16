const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone');// commentJS

const app = express();

// Configuración de la sesión
app.use(session({
    secret: 'p3-LCGG #chompy10-Sesionespersistentes',
    resave: false,           //No guarda la sesion si no ha sido modificada 
    saveUninitialized: true, //Guarda la sesion aun que no haya sisdo inicializada 
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 100}//usar secure:true solo si usas Https,maxAge permite  
}));
//Ruta para inicializar la sesion 
app.get ('/login/',(req, res)=>{
    if (!req.session.createdAt){
        req.session.createdAt=new Date();
        req.session.lastAcces=new Date();
        res.send('La sesion ha sido inicializada.')
    }else{
        res.send('Ya existe una sesion')
    }
});
//Ruta para actualizar la fecha de la ultima consulta 
app.get('update',(req, res)=>{
    if (!req.session.createdAt){
        req.session.createdAt=new Date();
        res.send('La fecha de ultimo acceso ha sido actuualizada.')
    }else{
        res.send('No hay una sesion activa ')
    }

});
//Ruta para para el estado de la sesion
app.get('/status',(req,res)=>{
    if (!req.session.createdAt){
        const now =new Date();
        const started= new Date(req.session.createdAt);
        const lastUpdate=new Date(req.session.lastAcces);
        //calcular antiguedad de la sesion 
        const sessionAgeMs=now -started;
        const hours= Math.floor(sessionAgeMs/(1000*60*60));
        const minutes= Math.floor(sessionAgeMs/(1000*60*60)/(1000*60));
        const seconds= Math.floor(sessionAgeMs/(1000*60)/1000);
        //converir las fechas al uso horario de CDMX
        const createdAt_CDMX=moment(started).tz('America/MExico_City').format('YYYY-MM-DD HH:mm:ss');
        const lastAcces_CDMX=moment(lastUpdate).tz('America/MExico_City').format('YYYY-MM-DD HH:mm:ss');

        res.json({
            mensaje: 'Estado de la sesion',
            sessionId:  req.sessionID,
            inicio: createdAt_CDMX,
            ultimoAcceso: lastAcces_CDMX,
            antiguedad: `${hours} horas, ${minutes} minutes y ${seconds} segundos`
        });
    }else{
        res.send('No hay una sesion activa')
    }
});

//Ruta para cerrar la sesion
a

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


