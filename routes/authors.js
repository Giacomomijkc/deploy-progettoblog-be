const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');

const AuthorsModel = require('../models/authorModel');
const PostsModel = require('../models/postModel');
const verifyToken = require('../middlewares/verifyToken');
//const { authorsBodyParams, validatePostAuthor } = require('../middlewares/authorPostValidation');
//const {validatePatchBodyAuthors, validatePatchBodyAuthorMiddleware} = require('../middlewares/authorPatchValidations')

const multer = require('multer');
const cloudinary = require ('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const crypto = require('crypto');

const author = express.Router()

//come recuperare il nome del file
const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split(".").pop();
		cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
    },
});

// questo è un middleware che va messo nelle rotte dove carichiamo immagini
const uploads = multer({storage: internalStorage});

//il contenuto di uploads.single('') dovrà sempre essere uguale al name dell'input
author.post('/authors/uploadImg', uploads.single('avatar'), async (req, res) =>{
    const url = req.protocol + "://" + req.get("host");
    try {
        const imgUrl = req.file.filename;
        res.status(200).json({ avatar: `${url}/uploads/${imgUrl}` })
    } catch (error) {
        console.error('File upload failed', error);
        res.status(500).json({ avatar: "File upload failed" });
    }
});

author.patch('/authors/:authorId/updateImg', uploads.single('avatar'), async (req, res) =>{
    const url = req.protocol + "://" + req.get("host");
    const {authorId} = req.params;
    const authorExist = await AuthorsModel.findById(authorId);

    if(!authorExist){
        res.status(400).send({
            statusCode: 400,
            message:`Author with id ${authorId} not found`
        })
    }
    try {
        const imgUrl = req.file.filename;
        const dataToUpdate = {avatar: `${url}/uploads/${imgUrl}`};
        const options = {new: true}
        const result = await AuthorsModel.findByIdAndUpdate(authorId, dataToUpdate, options);

        res.status(200).json({
            avatar: result.avatar,
            statuCode: 202,
            message: `Author with id ${authorId} successfully updated`,
            result
        })
    } catch (error) {
        console.error('Author updating failed', error);
        res.status(500).json({ error: "Author updating failed" });
    }
} )

author.get('/authors/:authorId', async (req, res) => {
    const { authorId } = req.params;

    try {
        const authorById = await AuthorsModel.findById(authorId)
        .populate("posts")

        res.status(200).send({
            statusCode: 200,
            authorById,
        });

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
})

author.get('/authors/:id/posts', async (req, res) => {
    const {id} = req.params;

    try {
        const findAuthor = await AuthorsModel.findById(id)

        if (!findAuthor) {
            return res.status(404).send({
                statusCode: 404,
                message: `Author with id ${id} not found`
            });
        }
   
        const findPost = await PostsModel.find({author: findAuthor._id})
    
    
        res.status(200).send({
            statusCode: 200,
            message: `posts of Author with id ${id} successfully finded`,
            findPost
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
})

author.get('/authors', async (req, res)  =>{
    try {
        const authors = await AuthorsModel.find()
        .populate("posts")

        res.status(200).send({
            statusCode: 200,
            authors: authors,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
});

//rimettere validazioni
author.post('/authors/create', async (req, res) => {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newAuthor = new AuthorsModel({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        dateOfBirth: req.body.dateOfBirth,
        avatar: req.body.avatar
    })

    try {
        const author = await newAuthor.save();

        res.status(201).send({
            statusCode: 201,
            message: 'Author successfully created',
            payload: author
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
})

//rimettere validazioni
author.patch('/authors/:authorId', verifyToken, async (req, res) => {
    const { authorId } = req.params;

    const authorExist = await AuthorsModel.findById(authorId);

    if(!authorExist){
        res.status(404).send({
            statusCode: 404,
            message: `Author with id ${authorId} not found`
        });
    }

    try {
        const id = authorId;
        const dataToUpdate = req.body;
        const options = {new: true}

        const result = await AuthorsModel.findByIdAndUpdate(id, dataToUpdate, options);

        res.status(200).send({
            statusCode: 200,
            message: `Author with id ${id} successfully edited`,
            result  
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
})

author.delete('/authors/:authorId', verifyToken, async (req, res) => {
    const { authorId } = req.params;

    const authorExist = await AuthorsModel.findById(authorId);

    if(!authorExist){
        res.status(404).send({
            statusCode: 404,
            message: `Author with id ${authorId} not found`
        });
    }

    try {

        const authorPosts = await PostsModel.find({ author: authorId });

        await Promise.all(authorPosts.map(async (post) => {
            await PostsModel.findByIdAndDelete(post._id);
        }));

      await AuthorsModel.findByIdAndDelete(authorId)

        res.status(200).send({
            statusCode: 200,
            message: `Author with id ${authorId} successfully deleted`
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error,
        });
    }
})

module.exports = author;