const express = require('express');
const jwt = require('jsonwebtoken');
const usuario = express.Router();
const db = require('../config/database');


usuario.post("/", async (req, res, next) => {
    const { nombre_usuario, correo_usuario, contra_usuario } = req.body;

    if (nombre_usuario && correo_usuario && contra_usuario) {
        let query = "INSERT INTO usuarios (nombre_usuario, correo_usuario, contra_usuario) ";
        query += `VALUES ('${nombre_usuario}', '${correo_usuario}', '${contra_usuario}')`;
        console.log("aqui");
        const rows = await db.query(query);
        console.log("gola");
        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "USUARIO REGISTRADO CORRECTAMENTE" });
        }
        return res.status(500).json({ code: 500, message: "OCURRIO UN ERROR" });
    }
    return res.status(500).json({ code: 500, message: "CAMPOS INCOMPLETOS" });
});

usuario.post("/login", async (req, res, next) => {
    const {correo_usuario, contra_usuario} = req.body;
    const query = `SELECT * FROM usuarios WHERE correo_usuario = '${correo_usuario}'and contra_usuario = '${contra_usuario}'`;
    const rows = await db.query(query);

    if(correo_usuario && contra_usuario) {
        if(rows.length == 1) {
            const token = jwt.sign({
                id_usuario: rows[0].id_usuario,
                correo_usuario: rows[0].correo_usuario
            }, "debugkey");
            return res.status(200).json({code:200, message: token});
        }
        else{
            return res.status(401).json({code:401, message: "usuario y/o contraseña incorrecta"});
        }
    }
    return res.status(500).json({code:500, message: "campos incompletos"});
});

usuario.get("/", async (req, res, next) => {
    const query = "SELECT * FROM usuarios";
    const rows = await db.query(query);

    return res.status(200).json({code:200, message: rows});
});

module.exports = usuario;