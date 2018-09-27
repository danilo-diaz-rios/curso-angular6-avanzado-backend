'use strict'

// modulos
var fs = require('fs');
var path = require('path');

// modelos
var User = require('../models/user');
var Animal = require('../models/animal');

// acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de animales y la acción pruebas',
        user: req.user
    });
}

module.exports = {
    pruebas
};