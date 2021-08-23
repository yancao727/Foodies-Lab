const mongoose = require('mongoose');
const Snacks = require('../models/snacks');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/foodies-lab', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => { 
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
// const sample = array => array[Math.floor(Math.random() * 18)];

const seedDB = async () => {
    await Snacks.deleteMany({});
    for (let i=0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20);
        const snack = new Snacks({
            author: "610883c46c5ec0f6b8ac4448",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}` ,
            image: 'https://images.unsplash.com/photo-1535568824865-a801351e8483?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
            description: 'best snack ever!',
            price
        })
        await snack.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})