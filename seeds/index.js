const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
require('dotenv').config(); 

mongoose.connect(process.env.DbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedImage= async(query)=>{
    const accessKey= process.env.Picquest_AccessKey;
    const response= await  fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`);
    const data= await response.json();
    return data.results[0].urls.small;
}

const seedDB = async () => {
    // await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random100 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'668ae38e7634f2de07bfaebb',
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images:{
                url: await seedImage(`${sample(descriptors)} ${sample(places)}`),
                filename:` image/${sample(descriptors)}/${sample(places)}`
            },geometry: {
                type: "Point",
                coordinates: [
                    cities[random100].longitude,
                    cities[random100].latitude,
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})