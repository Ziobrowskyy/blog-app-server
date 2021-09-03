import express from "express"
import fs from "fs"
import cors from "cors"
import path from "path"
import multer from "multer"
import {MongoClient} from "mongodb"
import {Post} from "./post"

//express app and port to run at
const app = express()
const port = 8000

//routing static files (including images)
app.use("/static", express.static("uploads"))

//body parser use to handle request
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

//file save handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const suffix = Date.now()
        cb(null, suffix + file.originalname)
    }
})
const imageUpload = multer({storage: storage}).array("files")
// const imageUpload = upload.array("images")


//mongodb preferences
const mongoUrl = 'mongodb://localhost:27017/'
const dbName = 'portal'
const collectionName = "entries"

const client = new MongoClient(mongoUrl + dbName, {useNewUrlParser: true, useUnifiedTopology: true})

client.connect((err, db) => {
    if (err) throw err

    const database = db.db(dbName)
    const collection = database.collection(collectionName)

    //create post
    app.post('/post', (req, res) => {

        console.log("Message arrived at POST:/post")
        console.log(req.body)
        const post = new Post(req.body)

        console.log("Post to json")
        console.log(JSON.stringify(post));

        collection.insertOne(post).then(
            (successResult) => {
                res.status(200).json({
                    "success": true,
                    "message": successResult
                })
            },
            (failMessage) => {
                res.status(400).json({
                    "success": false,
                    "message": "Failed to add data to database. " + failMessage
                })
            })

    })


    //update post
    app.put('/post/:id', (req, res) => {
        const id = req.body.id
        if (!req.body.params.id) {
            res.status(400).json({
                "success": false,
                "message": "Missing body parameters"
            })
        }
        collection.updateOne(
            {_id: req.body.id},
            {}
        ).then(
            (successResult) => {
                res.status(200).json({
                    "success": true,
                    "message": successResult
                })
            },
            (failMessage) => {
                res.status(400).json({
                    "success": false,
                    "message": "Failed to update. " + failMessage
                })
            })
    })

    //delete post
    app.delete('/post/:id', async (req, res) => {
        const result = await collection.deleteOne({_id: req.body.id}).then(
            (successResult) => {
                res.status(200).json({
                    "success": true,
                    "message": successResult
                })
            },
            (failMessage) => {
                res.status(400).json({
                    "success": false,
                    "message": "Failed to delete document. " + failMessage
                })
            })

    })
    //get post
    app.get('/post/:id', async (req, res) => {
        collection.findOne({_id: req.body.id}).then(
            (successResult) => {
                res.status(200).json({
                    "success": true,
                    "message": successResult,
                    "data": JSON.stringify(successResult)
                })
            },
            (failMessage) => {
                res.status(400).json({
                    "success": false,
                    "message": "Failed to find document. " + failMessage
                })
            })

    })

    app.get('/posts', async (req, res) => {
        const documents = await collection.find().toArray()
        if (documents) {
            res.status(200).json({
                "success": true,
                "message": "",
                "data": JSON.stringify(documents)
            })
        } else {
            res.status(400).json({
                "success": false,
                "message": "Failed to find documents"
            })
        }
    })

    app.get("/", async (req, res) => {
        console.log("access on / route")
        // res.status(200).json({
        //     "success": true,
        //     "data": new Date().toString()
        // })
        const query = {}

        const options = {}

        const cursor = await collection.find(query, options)

        const data = await cursor.map(it => {
            return {
                title: it.title,
                content: it.content,
                type: it.content,
                images: it.images
            }
        }).toArray()

        // console.log(`Entries: ${data}`)
        // console.log(`Entries found: ${data.length}`)
        //
        // res.render("wpisy", { data })
    })

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

})
