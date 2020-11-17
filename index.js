const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujfln.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send("Hi from db,this working very good")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const apartmentCollection = client.db("apartmentHunt").collection("apartments");
    const bookingCollection = client.db("apartmentHunt").collection("bookings");
    const adminCollection = client.db("apartmentHunt").collection("admins");

    //to add apartment for rent add rent house page
    app.post('/addApartmentForRent', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString("base64");

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, "base64"),
        };
        apartmentCollection
            .insertOne({ name, description, image })
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })

    // to show all apartment in home page
    app.get('/allApartments', (req, res) => {
        apartmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    //individual apartment rent list by email
    app.get('/apartmentRentlistByEmail', (req, res) => {
        email = req.query.email
        apartmentCollection.find({ email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    //.........finish apartmentCollection.......//

    //to add booking from individual apartment booking page
    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        bookingCollection.insertOne(booking)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // to show all bookings in a booking list page
    app.get('/bookings', (req, res) => {
        bookingCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // to show individual booking in a booking list page
    app.get('/bookinglistByEmail', (req, res) => {
        email = req.query.email
        bookingCollection.find({ email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //........finish bookingCollection........//

    //...start admin....//
    app.post("/addAdmin", (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.post("/isAdmin", (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email }).toArray((err, admins) => {
            res.send(admins.length > 0);
        });
    });

    //....finish admin....//


});





app.listen(process.env.PORT || port)