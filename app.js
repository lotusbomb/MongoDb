const express = require('express')
const {connectToDb, getDb} = require('./db')
const {ObjectId} = require('mongodb')

//init app & middleware
const app = express()
app.use(express.json())

//db connection
let db

connectToDb((error) => {
    if(!error){
        app.listen(3000, function(){
            console.log("You are listening to port 3000")
        })
        db = getDb()
    }
})


//routes
app.get('/books', (req, resp) => {

    //current page
    const page = req.query.p || 0
    const booksPerPage = 3

    let books = []
    // console.log('DB Object:', db);  // Add this line to see the state of `db`
    // if (!db) {
    //     return resp.status(500).json({ error: 'Database not initialized' });
    // }

    db.collection('books')
    .find()
    .sort({author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))//or .toArray()
    .then(() => {
        resp.status(200).json(books)
    })// or .then(books => {resp.status(200).json(books)})
    .catch(() => {
        resp.status(500).json({error: 'Could not fetch documents'})
    })
    //resp.json({msg: "welcome to the api"})
})

app.get('/books/:id', (req, resp) => {

    if(ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then((doc) => {
                resp.status(200).json(doc)
            })
            .catch((error) => {
                resp.status(500).json({ error: 'Could not fetch documents' })
            })
    }else {
        resp.status(500).json({error: 'Not a valid id'})
    }

})

app.post('/books', (req, resp) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            resp.status(201).json(result)
        })
        .catch(error => {
            resp.status(500).json({error: 'Not a valid post'})
        })
})

app.delete('/books/:id', (req, resp) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then((result) => {
                resp.status(200).json(result)
            })
            .catch((error) => {
                resp.status(500).json({ error: 'Could not delete documents' })
            })
    } else {
        resp.status(500).json({ error: 'Not a valid id' })
    }
})

app.patch('/books/:id', (req, resp) => {
    const updates = req.body
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
            .then((result) => {
                resp.status(200).json(result)
            })
            .catch((error) => {
                resp.status(500).json({ error: 'Could not update documents' })
            })
    } else {
        resp.status(500).json({ error: 'Not a valid id' })
    }
})