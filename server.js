// Import
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

// Variable
let PORT = process.env.PORT || 5000
const mongodbConnectionString = 'mongodb+srv://jamox2:20040210Jv@animelist.rfv67.mongodb.net/?retryWrites=true&w=majority'

// Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json()) //use this if i want to get req.bod


MongoClient.connect(mongodbConnectionString, {useUnifiedTopology: true})
.then(dataDB=>{
        const dbCollection = dataDB.db("animeList")
        const animeDocs = dbCollection.collection('anime')
        app.use(bodyParser.urlencoded({extended: true}))
        app.get('/', (req,res)=>{
            dbCollection.collection('anime').find().toArray()
            .then(result=>{
                res.render( 'index.ejs', { anime: result } )
            })
        })
        app.post('/api/animeList', (req,res)=>{
            const form = req.body
            const isFound = form.animeName.length > 0 && form.animeRating.length > 0
            if(isFound){
                animeDocs.insertOne(
                    {
                        _id: req.body._id,
                        animeName: req.body.animeName.split(" ").map(x=>x.charAt(0).toUpperCase() + x.slice(1)).join(" "),
                        animeRating: req.body.animeRating,
                        watchStatus: req.body.watchStatus || 'off'
                    }
                )
                    .then(result=>{
                        res.redirect('/')
                    })

            }else{
                res.redirect('/')
            }
        })
        app.delete('/api/animeList', (req,res)=>{
            animeDocs.deleteOne({ animeName: req.body.animeName })
                .then(result=>{
                    return res.json('Deleted')
                })
        })
        app.put('/api/animeList', (req,res)=>{
            let status = req.body.watchStatus
            animeDocs.findOneAndUpdate(
                { animeName: req.body.animeName },
                {
                    $set: {
                        watchStatus: status
                    }
                },
                {
                    upsert: true
                }
            )
            res.status(200).json({msg: "Updated"})
        })

        app.listen(PORT, ()=>{
            console.log(`Server is running in PORT: ${PORT}`)
        })

    })
    .catch(err=>console.error(err))