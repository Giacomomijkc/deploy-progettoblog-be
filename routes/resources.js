const mongoose = require('mongoose');
const express = require('express');

const ResourcesModel = require('../models/resourcesModel');

const resource = express.Router();

resource.get('/resources/isActive', async (req,res) =>{
    const {isActive} = req.query;
    try {

        const totalIsActive = await ResourcesModel.count({
            isActive:{$eq: true},
          });

        const userIsActive = await ResourcesModel.find({
            isActive: true,
        })

        res.status(200).send({
            totalIsActive: totalIsActive,
            statusCode: 200,
            isActive: userIsActive,
        })
        
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})

/*
resource.get('/resources/ageGreaterThan26', async (req, res) =>{
    const {age} = req.query;

    try {
        const userGreaterThan26 = await ResourcesModel.find({
            age: {$gt: 26},
        })

        res.status(200).send({
            statusCode: 200,
            userGreaterThan26,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})
*/

/*
resource.get('/resources/ageLessThan30', async (req,res) => {
    const {age} = req.query;

    try {
        const totalUserLessThan30 = await ResourcesModel.count({
            age: {$lt:30},
        })
        const userLessThan30 = await ResourcesModel.find({
            age: {$lt: 30},
        })

        res.status(200).send({
            statusCode: 200,
            totalUserLessThan30: totalUserLessThan30,
            userLessThan30,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})
*/

//route to find user in a specific age range

resource.get('/resources/ageRange', async (req,res) => {
    const {minAge, maxAge} = req.query;

    try {

        const totalUsersInRange = await ResourcesModel.count({
            age: {$gt: parseInt(minAge), $lt: parseInt(maxAge)}
        })

        const usersInRange = await ResourcesModel.find({
            age: {$gt: parseInt(minAge), $lt: parseInt(maxAge)}
        })

        res.status(200).send({
            totalUsersInRange: totalUsersInRange,
            statusCode: 200,
            usersInRange,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})

resource.get('/resources/company', async (req, res) => {
    const {companyName} = req.query;

    try {
        const totalUsersCompanyName = await ResourcesModel.count({
            company:{$eq: companyName}
        })
        
        const userCompanyName =await ResourcesModel.find({
            company:{$eq: companyName}
        })

        res.status(200).send({
            totalUsersCompanyName,
            statusCode: 200,
            userCompanyName: userCompanyName.map(user => user.email)
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})

resource.get('/resources/eyeBrownOrBlue/', async (req,res) => {
    const eyeColors = req.query.eye; // Ottieni i valori dei parametri "eye" dalla richiesta
    const eyeColorsArray = Array.isArray(eyeColors) ? eyeColors : [eyeColors]; // Se è un array, usa direttamente i valori, altrimenti crea un array con un singolo valore

    try {

        const totalUserEyesBrownOrBlue = await ResourcesModel.count({
            eyeColor: { $in: eyeColorsArray }
        })

        const userEyesBrownOrBlue = await ResourcesModel.find({
            eyeColor: { $in: eyeColorsArray }
        })

        res.status(200).send({
            totalUserEyesBrownOrBlue: totalUserEyesBrownOrBlue,
            statusCode: 200,
            userEyesBrownOrBlue,
        })
        
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})

resource.get('/resources/eyeDifferentColor/', async (req,res) => {
    const {eye} = req.query;

    try {

        const totalUserEyeDifferentColor = await ResourcesModel.count({
            eyeColor: { $ne: eye }
        })

        const userEyeDifferentColor = await ResourcesModel.find({
            eyeColor: { $ne: eye }
        })

        res.status(200).send({
            totalUserEyeDifferentColor: totalUserEyeDifferentColor,
            statusCode: 200,
            userEyeDifferentColor,
        })
        
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})

resource.get('/resources/eyeColorsDifferent', async (req,res) => {
    const eyeColors = req.query.eye;
    const eyeColorsArray = Array.isArray(eyeColors) ? eyeColors : [eyeColors];

    try {
        const totalUserEyeDifferentsColors = await ResourcesModel.count({
            eyeColor: { $nin: eyeColorsArray }
        })

        const userEyeDifferentsColors = await ResourcesModel.find({
            eyeColor: { $nin: eyeColorsArray }
        })

        res.status(200).send({
            totalUserEyeDifferentsColors: totalUserEyeDifferentsColors,
            statusCode: 200,
            userEyeDifferentsColors,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})

resource.get('/resources', async (req, res) =>{
    try {
        const resources = await ResourcesModel.find()
        const totalResources = await ResourcesModel.count()

        res.status(200).send({
            totalResources: totalResources,
            statusCode: 200,
            resources: resources,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error,
        })
    }
})

module.exports = resource;