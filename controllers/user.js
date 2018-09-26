'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var User = require('../models/user');

// servicio jwt
var jwt = require('../services/jwt');

// acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la acción pruebas'
    });
}

function saveUser(req, res){
    // Crea objeto usuario
    var user = new User();

    // Recoger parametros peticion
    var params = req.body;

    if(params.password && params.name && params.surname && params.email){
        // Asignar valores al objeto de usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
            if(err){
                res.status(500).send({message:'Error al comprobar el usuario'});
            }else{
                if(!issetUser){

                    // Cifrar contraseña
                    bcrypt.hash(params.password, null, null, function(err, hash){
                        user.password = hash;

                        // Guardar usuario en bd
                        user.save((err, userStored) => {
                            if(err){
                                res.status(500).send({message:'Error al guardar el usuatio'});
                            }else{
                                if(!userStored){
                                    res.status(404).send({message: 'No se ha registrado el usuario'});
                                }else{
                                    res.status(200).send({message: userStored});
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({
                        message: 'El usuario no puede registrarse'
                    });
                }
            }
        });

    }else{
        res.status(200).send({
            message: 'Introduce los datos correctamente para poder registrar al usuario'
        });
    }
}

function login(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message:'Error al comprobar el usuario'});
        }else{
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){

                        if(params.gettoken){
                            //devolver el token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                        

                    }else{
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse correctamente'
                        });
                    }
                });

            }else{
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                })
            }
        }
    });
    
   
}

module.exports = {
    pruebas,
    saveUser,
    login
};