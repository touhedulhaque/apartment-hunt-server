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
    res.send("welcome to apartment hunt backend")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const apartmentCollection = client.db("apartmentHunt").collection("apartments");
    const bookingCollection = client.db("apartmentHunt").collection("bookings");
    const rentedApartmentCollection = client.db("apartmentHunt").collection("rentedApartments");
    const adminCollection = client.db("apartmentHunt").collection("admins");

    //to add apartment for rent add rent house page
    app.post('/addApartment', (req, res) => {
        const apartment = req.body;
        apartmentCollection.insertOne(apartment)
            .then(result => {
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
    ///........finish apartment section...//

    //.....start rentedApartmentCollection.....//
    //.....add rented apartment...///
    app.post('/addRentedApartment', (req, res) => {
        const rentedApartment = req.body;
        rentedApartmentCollection.insertOne(rentedApartment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //individual apartment rent list by email
    app.get('/apartmentRentlistByEmail', (req, res) => {
        email = req.query.email
        rentedApartmentCollection.find({ email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    //.........finish rentedApartmentCollection.......//

    //to add booking from individual apartment booking page
    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        bookingCollection.insertOne(booking)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // to show all bookings in a booking list page
    app.get('/allBookings', (req, res) => {
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
