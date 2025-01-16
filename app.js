const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone');// commentJS

const app = express();

// Configuración de la sesión
app.use(session({
    secret: 'p3-LCGG #chompy10-Sesionespersistentes',
    resave: false,           //No guarda la sesion si no ha sido modificada 
    saveUninitialized: true, //Guarda la sesion aun que no haya sido inicializada 
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 100}//usar secure:true solo si usas Https,maxAge permite  
}));

app.get('/update', (req, res) =>{
    if(req.session.createAt){
        req.session.lastAcess = new Date();
        res.send('La fecha de último acceso ha sido actualizada')
    }else{
        res.send('No hay una sesión activa');
    }
})

//Ruta para inicializar la sesion 
app.get('/login/:name', (req ,res) =>{
    const userName = req.params.name;
    if(!req.session.createAt){
        req.session.userName = userName;
        req.session.createAt= new Date();
        req.session.lastAcess= new Date ();
        //req.session.createAt = new Date();
        //req.session.lastAcess= new Date();
        res.send(`
            <h1>Bienvenido, tu sesión ha sido iniciada</h1>
            <p><strong>Nombre de usuario: </strong> ${userName}</p>
            <p><a href="/session">Ir a detalles de la sesión</a></p>
            `)
    }else{
        res.send('<h1>Ya existe una sesión</h1>')
    }
})

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

// Middleware para mostrar detalles de la sesión


// Ruta para mostrar la información de la sesión
app.get('/session', (req, res)=>{
    if(req.session && req.session.userName){
        const userName = req.session.userName;
        const sessionId= req.session.id;
        const createAt= new Date(req.session.createAt);
        const lastAcess= new Date(req.session.lastAcess);
        const sessionDuration= ((new Date()-createAt)/1000).toFixed(2);

        res.send(`
        <h1>Detalles de la sesión.</h1>
        <p><strong>ID de la sesión:</strong> ${sessionId}</p>
        <p><strong>Nombre de usuario:</strong> ${userName}</p>
        <p><strong>Fecha de creación de la sesión:</strong> ${createAt}</p>
        <p><strong>Último acceso:</strong> ${lastAcess}</p>
        <p><strong>Duración de la sesión (en segundos): </strong> ${sessionDuration}</p>
        <p><a href="/logout">Cerrar sesión</a></p>
        `)
    }else{
        res.send(`
            <h1>No hay sesión activa.</h1>
            <p><a href="/login/Invitado">Iniciar sesión como Invitado</a></p>
            `);
        }
    });

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy((err) => {
            if(err){
                return res.status(500).send('Error al cerrar sesión');
            }
            res.send('<h1>Sesión cerrada exitosamente.</h1>')
        })
    }else{
        res.send('No hay una sesión activca para cerrar')
    }

})

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});


