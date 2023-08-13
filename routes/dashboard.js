const express = require('express');
const dashboard = express.Router();
const jwt = require('jsonwebtoken');
const AuthorsModel = require('../models/authorModel'); // Assumi che il modello dell'utente sia definito in authorModel.js
const verifyToken = require('../middlewares/verifyToken');

dashboard.get('/dashboard', verifyToken, async (req, res) => {
    try {
        // Accesso ai dati dell'utente decodificati dal token grazie al middleware 'verifyToken'
        const { _id } = req.user;
    
        // Usa l'id dell'utente per recuperare i dati dell'utente dal database
        const user = await AuthorsModel.findById(_id);
    
        // Se l'utente non è presente nel database, restituisci un errore
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Restituisci i dati dell'utente come risposta
        res.status(200).json({
          name: user.name,
          surname: user.surname,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          avatar: user.avatar,
          posts: user.posts,
          _id: user._id
          // Altri campi dell'utente che desideri visualizzare nella Dashboard
        });
      } catch (error) {
        console.error('Error occurred while fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

module.exports = dashboard;