const morgan = require('morgan');
const express = require('express');
const app = express();
const sistema = require('./routes/sistema');
const usuario = require('./routes/usuario');

app.use(morgan('dev')); //borrala al final  npm remove morgan --save
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res, next) => {
    return res.status(200).json({code:1, message:"Bienvenido al proyecto"});
});

app.use("/usuario", usuario);

app.use((req, res, next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "debugkey");
        req.usuario = decoded;
        console.log("hola");
        next();
        
    }
    catch(error) {
        return res.status(401).json({code:401, message:"No tienes permiso"});
    }
});
app.use("/sistema", sistema);

app.use((req, res, next) =>{
    return res.status(404).json({code:404, message:"URL no encontrada"});
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running...");
});