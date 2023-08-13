const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const AuthorsModel = require('../models/authorModel');
const jwt = require('jsonwebtoken');

login.post('/login', async (req, res) =>{
    const user = await AuthorsModel.findOne({email: req.body.email});

    if(!user){
        return res.status(404).send({
            statusCode: 404,
            message: 'Email or password not valid'
        });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword){
        return res.status(400).send({
            statusCode: 400,
            message: 'Email or password not valid'
        });
    }

    //generare token
    const token = jwt.sign({
        name: user.name,
        surname: user.surname,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        _id: user._id,
        
    }, process.env.JWT_SECRET,
    {expiresIn: '24h'}
    );

    res.header('Authorization', token).status(200).send({
        statusCode: 200,
        token
    })
});



module.exports = login;