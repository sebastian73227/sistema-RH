const express = require('express');
const sistema = express.Router();
const db = require('../config/database');

// insertamos un nuevo empleado
sistema.post("/", async (req, res, next) => {
    const { nombre, apellidos, telefono, correo, direccion } = req.body;

    if (nombre && apellidos && telefono && correo && direccion) {
        let query = "INSERT INTO empleados (nombre, apellidos, telefono, correo, direccion)";
        query += `VALUES('${nombre}', '${apellidos}', '${telefono}', '${correo}', '${direccion}')`;

        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "EMPLEADO INSERTADO CORRECTAMENTE :)" });
        }
        return res.status(500).json({ code: 500, message: "NO SE PUDO INSERTAR" });
    }
    return res.status(500).json({ code: 500, message: "FALTAN DATOS" });
    //return res.status(200).send(req.body);
});

//  borramos un empleado
sistema.delete("/:id([0-9]{1,2})", async (req, res, next) => {
    let query = `DELETE FROM empleados WHERE id = ${req.params.id}`;
    const rows = await db.query(query);

    if (rows.affectedRows == 1) {
        return res.status(201).json({ code: 201, message: "EMPLEADO BORRADO CORRECTAMENTE" });
    }
    return res.status(404).json({ code: 404, message: "EMPLEADO NO ENCONTRADO" });

});
//aqui se actualiza todo
sistema.put("/:id([0-9]{1,2})", async (req, res, next) => {
    const { nombre, apellidos, telefono, correo, direccion } = req.body;

    if (nombre && apellidos && telefono && correo && direccion) {
        let query = `UPDATE empleados SET nombre='${nombre}', apellidos= '${apellidos}', telefono= '${telefono}', correo= '${correo}', direccion= '${direccion}'`;
        query += `WHERE id=${req.params.id};`;

        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "EMPLEADO ACTUALIZADO" });
        }
        return res.status(404).json({ code: 404, message: "OCURRIO UN ERROR" });
    }
    return res.status(404).json({ code: 404, message: "CAMPOS INCOMPLETOS" });

});

//solo actualizamos el telefono
sistema.patch("/:id([0-9]{1,2})", async (req, res, next) => {
    if(req.body.telefono){
        let query = `UPDATE empleados SET telefono= '${req.body.telefono}' WHERE id=${req.params.id}`;
        const rows = await db.query(query);

        if(rows.affectedRows == 1) {
            return res.status(201).json({code:201, message:"telefono de empleado actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "OCURRIO UN ERROR"});
    }
    return res.status(500).json({code: 500, message: "DATOS INCOMPLETOS"});

});

sistema.get('/', async (req, res, next) => {
    const rh = await db.query("SELECT * FROM empleados");
    return res.status(200).json({ code: 200, message: rh });
});

sistema.get('/:id([0-9]{1,2})', async (req, res, next) => {
    const id = req.params.id;
    if (id >= 1 && id <= 4) {
        const rh = await db.query("SELECT * FROM empleados WHERE id=" + id + ";");
        return res.status(200).json({ code: 200, message: rh });
    }
    return res.status(404).json({ code: 404, message: "EMPLEADO NO ENCONTRADO" });
});

module.exports = sistema;