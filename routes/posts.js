const mongoose = require('mongoose');
const express = require('express');

const PostsModel = require('../models/postModel');
const AuthorsModel = require('../models/authorModel');
const verifyToken = require('../middlewares/verifyToken');
//const { postsBodyParams, validatePostBody } = require('../middlewares/postPostValidation');
//const { validatePatchBody, validatePatchBodyMiddleware } = require('../middlewares/postPatchValidation');
const multer = require('multer');
const cloudinary = require ('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const crypto = require('crypto');

const post = express.Router();

cloudinary.config({ 
    cloud_name: 'danz4sj8j', 
    api_key: '478532613423114', 
    api_secret: 'g7WJS-Q97F3SMCVAEyUJTd9X2Yk' 
  });

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'progettoBlog',
        format: async (req,file) => 'png',
        public_id: (req, file) => file.name,
    },
})

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

const cloudUpload = multer({storage: cloudStorage});

//il contenuto di uploads.single('') dovrà sempre essere uguale al name dell'input
post.post('/posts/uploadImg', uploads.single('cover'), async (req, res) =>{
    const url = req.protocol + "://" + req.get("host");
    try {
        const imgUrl = req.file.filename;
        res.status(200).json({ cover: `${url}/uploads/${imgUrl}` })
    } catch (error) {
        console.error('File upload failed', error);
        res.status(500).json({ error: "File upload failed" });
    }
});

post.post('/posts/cloudUpload', cloudUpload.single('cover'), async (req,res)=> {
    try {
        res.status(200).json({cover: req.file.path})
    } catch (error) {
        console.error('File upload failed',error);
        res.status(500).json({error: 'File upload failed'});
    }
})

post.patch('/posts/:postId/updateImg', uploads.single('cover'), async (req, res) => {
    const url = req.protocol + "://" + req.get("host");

    const { postId } = req.params;

    const postExist = await PostsModel.findById(postId);

    if (!postExist){
        res.status(400).send({
            statusCode: 400,
            message: `Post with id ${postId} not found`
        })
    }

    try {
      const imgUrl = req.file.filename;
      const dataToUpdate = { cover: `${url}/uploads/${imgUrl}` };
      const options = {new: true}
      const result = await PostsModel.findByIdAndUpdate(postId, dataToUpdate, options);
        
      res.status(200).json({ 
        cover: result.cover,
        statusCode: 202,
        message: `Post with id ${postId} successfully updated`,
        result
    });
    } catch (error) {
      console.error('File updating failed', error);
      res.status(500).json({ error: "File updating failed" });
    }
  });

post.get('/posts/:postId', async (req, res) => {
    const {postId} = req.params;

    const postExist = await PostsModel.findById(postId);

    if (!postExist){
        res.status(400).send({
            statusCode: 400,
            message: `Post with id ${postId} not found`
        })
    }

    try {
        const postById = await PostsModel.findById(postId)
        .populate("author")
        .populate("comments")

        res.status(200).send({
            statusCode: 200,
            postById
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
})


post.get('/posts/title', async (req, res) => {

    const {postTitle} = req.query;

    try {
        const postByTitle = await PostsModel.find({
            title: {
                $regex: '.*' + postTitle + '.*',
                $options: 'i'
            },
        })
        .populate("author")
        .populate("comments")

        if(!postByTitle || postByTitle.length<= 0){
            res.status(404).send({
                statusCode: 404,
                message:`post with title ${postTitle} not found`
            })
        }

        res.status(200).send({
            statusCode:200,
            postByTitle,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error,
        });
    }
})


post.get('/posts', async (req,res) => {

    try {
        const posts = await PostsModel.find()
        .populate("author")
        .populate("comments")

        res.status(200).send({
            statusCode: 200,
            posts: posts,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }

});


//rimettere validazione
post.post('/posts/create', verifyToken, async (req, res) => {

    const author = await AuthorsModel.findOne({_id: req.body.author});

    if(!author){
        return res.status(400).send({
            statusCode: 400,
            message:`Author with id ${_id} not found`
        })
    }

    const newPost = new PostsModel({
        category: req.body.category,
        title: req.body.title,
        cover: req.body.cover,
        readTime: {
            value: req.body.readTime.value,
            unit: req.body.readTime.unit,
          },
        author: author._id,
        content: req.body.content,
    })

    try {
        const post = await newPost.save();
        console.log(req);

        await AuthorsModel.updateOne({_id: author.id}, {$push: {posts: post}});

        res.status(201).send({
            statusCode: 201,
            message: 'Post succesfully created',
            payload: post
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message:'Internal server Error ',
            error
        });
    }
})

post.delete('/posts/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params;

    const postExist = await PostsModel.findById(postId);

    if (!postExist){
        res.status(400).send({
            statusCode: 400,
            message: `Post with id ${postId} not found`
        })
    }

    const authorId = await AuthorsModel.findOne({_id: req.body.authorId});

    if(!authorId){
        return res.status(400).send({
            statusCode: 400,
            message:`Author with id ${authorId} not found`
        })
    }

    try {
        const deletePostById = await PostsModel.findByIdAndDelete(postId);
        await AuthorsModel.updateOne({_id: authorId.id}, {$pull: {posts: deletePostById._id}});

        res.status(202).send({
            statusCode: 202,
            message: `Post with id ${postId} successfully deleted`,
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
post.patch('/posts/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params;

    const postExist = await PostsModel.findById(postId);

    if (!postExist){
        res.status(400).send({
            statusCode: 400,
            message: `Post with id ${postId} not found`
        })
    }

    try {
        const dataToUpdate = req.body;
        const options = {new: true}

        const result = await PostsModel.findByIdAndUpdate(postId, dataToUpdate, options);

        res.status(202).send({
            statusCode: 202,
            message: `Post with id ${postId} successfully updated`,
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

module.exports = post;
