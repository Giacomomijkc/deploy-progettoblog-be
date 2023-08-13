const express =  require ('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const PORT = 5050;

require('dotenv').config();

const authorsRoute = require('./routes/authors');
const postsRoute = require('./routes/posts');
const resourcesRoute = require('./routes/resources');
const commentsRoute = require('./routes/comments');
const loginRoute = require('./routes/login');
const dashboardRoute = require('./routes/dashboard');
const githubRoute = require('./routes/githubRoute')

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(cors());
//middleware
app.use(express.json())

//use routes
app.use('/', authorsRoute);
app.use('/', postsRoute);
app.use('/', resourcesRoute);
app.use('/', commentsRoute);
app.use('/', loginRoute);
app.use('/', dashboardRoute);
app.use('/', githubRoute);

mongoose.connect(process.env.MONGO_DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Errore di connessione al server!'))
db.once('open', ()=> {
    console.log('Database MongoDB Connesso!');
});

app.listen(PORT, () => console.log(`Server avviato ed in ascolto sulla porta ${PORT}`))